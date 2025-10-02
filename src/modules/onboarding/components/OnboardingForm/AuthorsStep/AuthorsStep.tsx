'use client';

import { Card } from '@/components/ui/Card';
import { CheckCircle2, Circle } from 'lucide-react';
import { Author } from '@/types/onboarding';

interface AuthorsStepProps {
  authors: Author[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function AuthorsStep({ authors, selectedIds, onToggle }: AuthorsStepProps) {
  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Follow Your Favorite Authors</h2>
          <p className="text-muted-foreground">Optional: Select authors you want to follow</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
          {authors.map((author) => {
            const isSelected = selectedIds.includes(author.id);
            return (
              <button
                key={author.id}
                type="button"
                onClick={() => onToggle(author.id)}
                className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{author.name}</h3>
                    <p className="text-xs text-muted-foreground">{author.source.name}</p>
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-sm text-muted-foreground text-center">
          {selectedIds.length} authors selected (optional)
        </div>
      </div>
    </Card>
  );
}
