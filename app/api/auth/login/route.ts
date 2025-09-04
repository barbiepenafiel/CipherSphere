import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { comparePassword } from '@/lib/auth';
import { SignJWT } from 'jose';

const MAX_FAILED_ATTEMPTS = 3;
const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key');

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is blocked
    if (user.blocked) {
      return NextResponse.json(
        { error: 'Account is blocked due to too many failed login attempts. Please contact an administrator.' },
        { status: 423 }
      );
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.passwordHash);

    if (!isValidPassword) {
      // Increment failed attempts
      const newFailedAttempts = user.failedAttempts + 1;
      const shouldBlock = newFailedAttempts >= MAX_FAILED_ATTEMPTS;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: newFailedAttempts,
          blocked: shouldBlock
        }
      });

      if (shouldBlock) {
        return NextResponse.json(
          { error: 'Account has been blocked due to too many failed login attempts' },
          { status: 423 }
        );
      }

      return NextResponse.json(
        { 
          error: `Invalid credentials. ${MAX_FAILED_ATTEMPTS - newFailedAttempts} attempts remaining.` 
        },
        { status: 401 }
      );
    }

    // Reset failed attempts on successful login
    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0 }
    });

    // Create JWT token
    const token = await new SignJWT({ 
      userId: user.id, 
      username: user.username,
      role: user.role 
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

    // Set HTTP-only cookie
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      },
      { status: 200 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
