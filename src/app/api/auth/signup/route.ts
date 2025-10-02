import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/modules/auth/services/authService';
import { signupSchema } from '@/modules/auth/utils/validation';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = signupSchema.parse(body);

    // Create user
    const user = await authService.signup(
      validatedData.email,
      validatedData.password,
      validatedData.name
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          message: 'Account created successfully. Please check your email to verify your account.',
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
            errors: error.errors,
          },
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      if (error.message === 'Email already registered') {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'EMAIL_ALREADY_EXISTS',
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
            code: 'SIGNUP_ERROR',
            message: error.message,
          },
        },
        { status: 500 }
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
