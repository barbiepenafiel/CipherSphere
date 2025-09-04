import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key');

interface JWTPayload {
  userId: string;
  username: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    let decoded: JWTPayload;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      decoded = payload as unknown as JWTPayload;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get pagination parameters
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get user's cipher history
    const [history, total] = await Promise.all([
      prisma.cipherHistory.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          method: true,
          inputText: true,
          outputText: true,
          key: true,
          qrCodeData: true,
          createdAt: true
        }
      }),
      prisma.cipherHistory.count({
        where: { userId: decoded.userId }
      })
    ]);

    return NextResponse.json({
      history,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
