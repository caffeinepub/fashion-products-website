import { Link } from '@tanstack/react-router';
import { Button } from './ui/button';
import { ShieldAlert } from 'lucide-react';

export default function AccessDeniedScreen() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <div className="bg-destructive/10 p-6 rounded-full">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You need administrator privileges to access this page.
          </p>
        </div>
        <Link to="/">
          <Button>Return to Products</Button>
        </Link>
      </div>
    </div>
  );
}
