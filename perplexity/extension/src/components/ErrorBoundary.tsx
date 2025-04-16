import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error }) => ReactNode);
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return typeof this.props.fallback === "function"
        ? this.props.fallback({ error: this.state.error! })
        : (this.props.fallback ?? (
            <div className="x:p-4 x:text-red-500">
              <h2 className="x:text-lg x:font-semibold">
                Something went wrong
              </h2>
              <p className="x:mt-2 x:text-sm">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
            </div>
          ));
    }

    return this.props.children;
  }
}
