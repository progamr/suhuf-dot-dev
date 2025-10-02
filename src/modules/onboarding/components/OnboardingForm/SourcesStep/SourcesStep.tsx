'use client';

import { Card } from '@/components/ui/Card';
import { CheckCircle2, Circle } from 'lucide-react';
import { Source } from '@/types/onboarding';

interface SourcesStepProps {
  sources: Source[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function SourcesStep({ sources, selectedIds, onToggle }: SourcesStepProps) {
  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Select Your Favorite Sources</h2>
          <p className="text-muted-foreground">Choose at least 2 news sources (minimum 2 required)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sources.map((source) => {
            const isSelected = selectedIds.includes(source.id);
            return (
              <button
                key={source.id}
                type="button"
                onClick={() => onToggle(source.id)}
                className={`relative p-6 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{source.name}</h3>
                    <p className="text-sm text-muted-foreground">{source.slug}</p>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-sm text-muted-foreground text-center">
          {selectedIds.length} of {sources.length} sources selected
          {selectedIds.length < 2 && ' (minimum 2 required)'}
        </div>
      </div>
    </Card>
  );
}
