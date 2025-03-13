import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-[200px] flex items-center justify-center bg-gaafu-muted/50 rounded-xl">
            <div className="text-center p-4">
              <p className="text-gaafu-foreground/60 font-dhivehi text-lg mb-2">
                މައްސަލައެއް ދިމާވެއްޖެ
              </p>
              <p className="text-sm text-gaafu-foreground/40">
                {this.state.error?.message ||
                  "An error occurred while rendering"}
              </p>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
