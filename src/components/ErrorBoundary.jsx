import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 p-4 flex items-center justify-center">
          <div className="max-w-md bg-white border-2 border-red-500 rounded p-6 shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h1>
            <p className="text-gray-700 mb-4">
              An unexpected error occurred. Please try refreshing the page or contact support.
            </p>
            {this.state.error && (
              <details className="mb-4 p-2 bg-gray-100 rounded text-sm text-gray-600 max-h-40 overflow-auto">
                <summary className="cursor-pointer font-semibold">Error details</summary>
                <pre className="mt-2 text-xs whitespace-pre-wrap break-words">{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-xs whitespace-pre-wrap break-words">{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
