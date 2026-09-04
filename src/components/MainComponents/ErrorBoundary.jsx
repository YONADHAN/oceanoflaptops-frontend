import React from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {

    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {

    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong.</h1>
            <p className="text-gray-600 mb-8">
              We encountered an unexpected error. Don't worry, our team has been notified. Please try refreshing the page.
            </p>

            <button
              onClick={this.handleReload}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors duration-200"
            >
              Reload Page
            </button>


            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-8 text-left bg-red-50 p-4 rounded-lg overflow-x-auto text-xs text-red-900">
                <p className="font-bold mb-2">{this.state.error.toString()}</p>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </div>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
