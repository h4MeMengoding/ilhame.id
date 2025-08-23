import React from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; onRetry?: () => void }>;
}

class ImageUploadErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ImageUpload Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const DefaultFallback = () => (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
          <div className='flex items-center space-x-2'>
            <FiAlertTriangle className='h-5 w-5 text-red-500' />
            <h3 className='text-sm font-medium text-red-800 dark:text-red-200'>
              Image Upload Error
            </h3>
          </div>
          <div className='mt-2'>
            <p className='text-sm text-red-700 dark:text-red-300'>
              {this.state.error?.message ||
                'Something went wrong with the image upload component.'}
            </p>
            <button
              onClick={() =>
                this.setState({ hasError: false, error: undefined })
              }
              className='mt-3 flex items-center space-x-1 rounded bg-red-100 px-3 py-1 text-sm text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700'
            >
              <FiRefreshCw className='h-4 w-4' />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      );

      const FallbackComponent = this.props.fallback || DefaultFallback;

      return (
        <FallbackComponent
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

export default ImageUploadErrorBoundary;
