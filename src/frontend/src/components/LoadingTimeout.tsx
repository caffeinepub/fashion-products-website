import { useEffect, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface LoadingTimeoutProps {
  isLoading: boolean;
  timeout?: number;
  onRetry?: () => void;
  loadingMessage?: string;
  timeoutMessage?: string;
}

export default function LoadingTimeout({
  isLoading,
  timeout = 15000,
  onRetry,
  loadingMessage = 'Loading...',
  timeoutMessage = 'This is taking longer than expected',
}: LoadingTimeoutProps) {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasTimedOut(false);
      return;
    }

    const timer = setTimeout(() => {
      if (isLoading) {
        setHasTimedOut(true);
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [isLoading, timeout]);

  const handleRetry = () => {
    setHasTimedOut(false);
    if (onRetry) {
      onRetry();
    }
  };

  if (!isLoading) return null;

  if (hasTimedOut) {
    return (
      <div className="flex items-center justify-center py-12">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Loading Timeout</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{timeoutMessage}. The connection might be slow or the service might be temporarily unavailable.</p>
            {onRetry && (
              <Button onClick={handleRetry} variant="outline" size="sm" className="w-full">
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">{loadingMessage}</p>
    </div>
  );
}
