import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { getEM } from '@/infrastructure/db/initDb';
import { User } from '@/infrastructure/entities/User';
import { VerificationToken } from '@/infrastructure/entities/VerificationToken';
import { emailService } from './emailService';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY_HOURS = 24;

export const authService = {
  /**
   * Register a new user
   */
  async signup(email: string, password: string, name?: string) {
    const em = await getEM();

    // Check if user already exists
    const existingUser = await em.findOne(User, { email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = em.create(User, {
      email,
      passwordHash,
      name,
      emailVerified: undefined,
    });

    await em.persistAndFlush(user);

    // Generate verification token
    const token = await this.generateVerificationToken(email);

    // Send verification email
    await emailService.sendVerificationEmail(email, token, name);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },

  /**
   * Validate user credentials (for login)
   */
  async validateUser(email: string, password: string) {
    const em = await getEM();

    const user = await em.findOne(User, { email });
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
    };
  },

  /**
   * Generate email verification token
   */
  async generateVerificationToken(email: string) {
    const em = await getEM();

    // Delete any existing tokens for this email
    await em.nativeDelete(VerificationToken, { identifier: email });

    // Generate random token
    const token = crypto.randomBytes(32).toString('hex');

    // Calculate expiry
    const expires = new Date();
    expires.setHours(expires.getHours() + TOKEN_EXPIRY_HOURS);

    // Create verification token
    const verificationToken = em.create(VerificationToken, {
      identifier: email,
      token,
      expires,
    });

    await em.persistAndFlush(verificationToken);

    return token;
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string) {
    const em = await getEM();

    // Find token
    const verificationToken = await em.findOne(VerificationToken, { token });

    if (!verificationToken) {
      throw new Error('Invalid or expired token');
    }

    // Check if expired
    if (verificationToken.expires < new Date()) {
      await em.removeAndFlush(verificationToken);
      throw new Error('Token has expired');
    }

    // Find user
    const user = await em.findOne(User, { email: verificationToken.identifier });

    if (!user) {
      throw new Error('User not found');
    }

    // Update user
    user.emailVerified = new Date();
    await em.persistAndFlush(user);

    // Delete token
    await em.removeAndFlush(verificationToken);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },

  /**
   * Resend verification email
   */
  async resendVerification(email: string) {
    const em = await getEM();

    // Check if user exists
    const user = await em.findOne(User, { email });
    if (!user) {
      throw new Error('User not found');
    }

    // Check if already verified
    if (user.emailVerified) {
      throw new Error('Email already verified');
    }

    // Generate new token
    const token = await this.generateVerificationToken(email);

    // Send email
    await emailService.sendVerificationEmail(email, token, user.name);

    return { message: 'Verification email sent' };
  },
};
