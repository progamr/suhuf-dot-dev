'use client';

type Step = 'sources' | 'categories' | 'authors';

interface StepIndicatorProps {
  currentStep: Step;
  sourcesComplete: boolean;
  categoriesComplete: boolean;
}

export function StepIndicator({ currentStep, sourcesComplete, categoriesComplete }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
            currentStep === 'sources'
              ? 'bg-primary text-primary-foreground'
              : sourcesComplete
              ? 'bg-green-500 text-white'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {sourcesComplete && currentStep !== 'sources' ? '✓' : '1'}
        </div>
        <span className={currentStep === 'sources' ? 'font-semibold' : 'text-muted-foreground'}>
          Sources
        </span>
      </div>

      <div className="h-0.5 w-16 bg-muted" />

      <div className="flex items-center gap-2">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
            currentStep === 'categories'
              ? 'bg-primary text-primary-foreground'
              : categoriesComplete
              ? 'bg-green-500 text-white'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {categoriesComplete && currentStep === 'authors' ? '✓' : '2'}
        </div>
        <span className={currentStep === 'categories' ? 'font-semibold' : 'text-muted-foreground'}>
          Categories
        </span>
      </div>

      <div className="h-0.5 w-16 bg-muted" />

      <div className="flex items-center gap-2">
        <div
          className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
            currentStep === 'authors'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          3
        </div>
        <span className={currentStep === 'authors' ? 'font-semibold' : 'text-muted-foreground'}>
          Authors
        </span>
      </div>
    </div>
  );
}
