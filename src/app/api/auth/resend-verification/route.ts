import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/modules/auth/services/authService';
import { resendVerificationSchema } from '@/modules/auth/utils/validation';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = resendVerificationSchema.parse(body);

    // Resend verification
    const result = await authService.resendVerification(validatedData.email);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RESEND_ERROR',
            message: error.message,
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
