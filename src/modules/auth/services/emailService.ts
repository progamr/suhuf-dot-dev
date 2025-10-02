import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailService = {
  /**
   * Send email verification email
   */
  async sendVerificationEmail(email: string, token: string, name?: string) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    try {
      const { data, error } = await resend.emails.send({
        from: 'Suhuf <onboarding@resend.dev>', // Use your verified domain later
        to: [email],
        subject: 'Verify your email - Suhuf',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verify your email</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Suhuf</h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0;">Your Personalized News Aggregator</p>
              </div>
              
              <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #333; margin-top: 0;">Welcome${name ? `, ${name}` : ''}! 👋</h2>
                
                <p>Thank you for signing up for Suhuf. To complete your registration and start reading personalized news, please verify your email address.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationUrl}" 
                     style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; 
                            padding: 14px 30px; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            display: inline-block;
                            font-weight: bold;">
                    Verify Email Address
                  </a>
                </div>
                
                <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
                <p style="background: white; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #667eea;">
                  ${verificationUrl}
                </p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                
                <p style="color: #999; font-size: 12px; margin: 0;">
                  This link will expire in 24 hours. If you didn't create an account with Suhuf, you can safely ignore this email.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
                <p>© ${new Date().getFullYear()} Suhuf. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error('Resend error:', error);
        throw new Error('Failed to send verification email');
      }

      console.log(`Verification email sent to ${email}`, data);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  },
};
