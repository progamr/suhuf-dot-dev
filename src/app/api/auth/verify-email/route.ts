import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/modules/auth/services/authService';
import { verifyEmailSchema } from '@/modules/auth/utils/validation';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    // Validate input
    const validatedData = verifyEmailSchema.parse({ token });

    // Verify email
    const user = await authService.verifyEmail(validatedData.token);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Email verified successfully. You can now log in.',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid token',
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
            code: 'VERIFICATION_ERROR',
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
