import { LucideIcon, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorMessageProps {
  message?: string;
  Icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export function ErrorMessage({ 
  message = 'An error occurred', 
  Icon = AlertCircle,
  actionLabel,
  onAction 
}: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="text-center space-y-4 max-w-md">
        <Icon className="h-12 w-12 mx-auto text-destructive" />
        <div className="text-destructive text-lg font-semibold">Error</div>
        <p className="text-muted-foreground">{message}</p>
        {actionLabel && onAction && (
          <Button onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
