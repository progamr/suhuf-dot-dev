import { z } from 'zod';

export const onboardingSchema = z.object({
  sourceIds: z.array(z.string()).min(2, 'Please select at least 2 sources'),
  categoryIds: z.array(z.string()).min(2, 'Please select at least 2 categories'),
  authorIds: z.array(z.string()).default([]),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
