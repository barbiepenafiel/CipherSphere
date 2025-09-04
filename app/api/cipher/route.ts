import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { applyCipher, CipherType } from '@/lib/ciphers';
import { generateQRCode } from '@/lib/qrcode';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'your-secret-key');

interface JWTPayload {
  userId: string;
  username: string;
  role: string;
}

export async function POST(request: NextRequest) {
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

    const { text, method, key, decrypt = false } = await request.json();

    // Validate input
    if (!text || !method) {
      return NextResponse.json(
        { error: 'Text and cipher method are required' },
        { status: 400 }
      );
    }

    // Validate cipher method
    if (!['ATBASH', 'CAESAR', 'VIGENERE'].includes(method)) {
      return NextResponse.json(
        { error: 'Invalid cipher method' },
        { status: 400 }
      );
    }

    // Apply cipher
    const cipherResult = applyCipher(text, method as CipherType, key, decrypt);
    
    if (!cipherResult.success) {
      return NextResponse.json(
        { error: cipherResult.error },
        { status: 400 }
      );
    }

    // Generate QR code for the result
    const qrCodeData = await generateQRCode(cipherResult.result);

    // Save to history
    const historyEntry = await prisma.cipherHistory.create({
      data: {
        userId: decoded.userId,
        method: method as CipherType,
        inputText: text,
        outputText: cipherResult.result,
        key: key?.toString() || null,
        qrCodeData
      }
    });

    return NextResponse.json({
      id: historyEntry.id,
      inputText: text,
      outputText: cipherResult.result,
      method,
      key,
      qrCodeData,
      createdAt: historyEntry.createdAt
    });

  } catch (error) {
    console.error('Cipher API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
