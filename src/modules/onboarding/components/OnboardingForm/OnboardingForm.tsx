'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';
import { useGetSourcesQuery } from '../../state/queries/getSourcesQuery';
import { useGetCategoriesQuery } from '../../state/queries/getCategoriesQuery';
import { useGetAuthorsQuery } from '../../state/queries/getAuthorsQuery';
import { useSavePreferencesMutation } from '../../state/mutations/savePreferencesMutation';
import { onboardingSchema, OnboardingFormData } from '../../validation/onboardingSchema';
import { OnboardingLoading } from '../OnboardingLoading';
import { StepIndicator } from './StepIndicator/StepIndicator';
import { SourcesStep } from './SourcesStep/SourcesStep';
import { CategoriesStep } from './CategoriesStep/CategoriesStep';
import { AuthorsStep } from './AuthorsStep/AuthorsStep';

type Step = 'sources' | 'categories' | 'authors';

interface OnboardingFormProps {
  userId: string;
}

export function OnboardingForm({ userId: _userId }: OnboardingFormProps) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>('sources');

  // Queries
  const { data: sources = [], isLoading: sourcesLoading } = useGetSourcesQuery();
  const { data: categories = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  const { data: authors = [], isLoading: authorsLoading } = useGetAuthorsQuery(50);

  // Mutation with onSuccess callback
  const savePreferencesMutation = useSavePreferencesMutation();

  // Form
  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      sourceIds: [],
      categoryIds: [],
      authorIds: [],
    },
    mode: 'onChange',
  });

  const sourceIds = watch('sourceIds');
  const categoryIds = watch('categoryIds');
  const authorIds = watch('authorIds');

  const toggleSelection = (id: string, field: 'sourceIds' | 'categoryIds' | 'authorIds') => {
    const currentIds = watch(field);
    const newIds = currentIds.includes(id)
      ? currentIds.filter((itemId) => itemId !== id)
      : [...currentIds, id];
    setValue(field, newIds, { shouldValidate: true });
  };

  const handleNext = () => {
    if (step === 'sources') {
      if (sourceIds.length < 2) return;
      setStep('categories');
    } else if (step === 'categories') {
      if (categoryIds.length < 2) return;
      setStep('authors');
    }
  };

  const handleBack = () => {
    if (step === 'categories') {
      setStep('sources');
    } else if (step === 'authors') {
      setStep('categories');
    }
  };

  const onSubmit = (data: OnboardingFormData) => {
    savePreferencesMutation.mutate(data, {
      onSuccess: () => {
        // Invalidate and refetch onboarding status
        queryClient.invalidateQueries({ queryKey: ['onboardingStatus'] });
        
        // Force a full page reload to ensure fresh data
        window.location.href = '/';
      },
    });
  };

  const onError = (errors: any) => {
    console.log('Form validation errors:', errors);
  };

  const isLoading = sourcesLoading || categoriesLoading || authorsLoading;

  if (isLoading) {
    return <OnboardingLoading />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Customize Your Feed
        </h1>
        <p className="text-lg text-muted-foreground">
          Select your favorite sources and categories to personalize your news experience
        </p>
      </div>

      {/* Progress Steps */}
      <StepIndicator
        currentStep={step}
        sourcesComplete={sourceIds.length >= 2}
        categoriesComplete={categoryIds.length >= 2}
      />

      {/* Error Messages */}
      {step === 'sources' && errors.sourceIds && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-center">
          {errors.sourceIds.message}
        </div>
      )}
      {step === 'categories' && errors.categoryIds && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-center">
          {errors.categoryIds.message}
        </div>
      )}
      {savePreferencesMutation.isError && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-center">
          {savePreferencesMutation.error instanceof Error
            ? savePreferencesMutation.error.message
            : 'Failed to save preferences'}
        </div>
      )}

      {/* Steps */}
      {step === 'sources' && (
        <SourcesStep
          sources={sources}
          selectedIds={sourceIds}
          onToggle={(id) => toggleSelection(id, 'sourceIds')}
        />
      )}

      {step === 'categories' && (
        <CategoriesStep
          categories={categories}
          selectedIds={categoryIds}
          onToggle={(id) => toggleSelection(id, 'categoryIds')}
        />
      )}

      {step === 'authors' && (
        <AuthorsStep
          authors={authors}
          selectedIds={authorIds}
          onToggle={(id) => toggleSelection(id, 'authorIds')}
        />
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={step === 'sources' || savePreferencesMutation.isPending}
          className="min-w-[120px]"
        >
          Back
        </Button>

        <div className="flex gap-4">
          {step === 'authors' && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSubmit(onSubmit, onError)}
              disabled={savePreferencesMutation.isPending}
              className="min-w-[120px]"
            >
              Skip
            </Button>
          )}

          {step !== 'authors' ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={
                (step === 'sources' && sourceIds.length < 2) ||
                (step === 'categories' && categoryIds.length < 2)
              }
              className="min-w-[120px]"
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit(onSubmit, onError)}
              disabled={savePreferencesMutation.isPending}
              className="min-w-[120px]"
            >
              {savePreferencesMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
