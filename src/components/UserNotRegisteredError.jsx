import React from 'react';
import { AlertTriangle } from 'lucide-react';

const UserNotRegisteredError = () => {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-4 bg-background text-foreground">
      <div className="max-w-md w-full p-8 rounded-3xl border bg-card text-card-foreground border-border card-shadow">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-secondary text-primary border border-border">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-foreground mb-4">Access Restricted</h1>
          <p className="text-muted-foreground mb-8">
            You are not registered to use this application. Please contact the app administrator to request access.
          </p>
          <div className="p-4 rounded-2xl text-sm text-left bg-secondary text-secondary-foreground border border-border">
            <p className="font-bold">If you believe this is an error, you can:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Verify you are logged in with the correct account</li>
              <li>Contact the app administrator for access</li>
              <li>Try logging out and back in again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;
