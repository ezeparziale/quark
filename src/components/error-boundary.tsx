"use client"

import Image from "next/image"

import { Component, type ErrorInfo, type ReactNode } from "react"

import { RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          className="bg-destructive/5 dark:bg-destructive/10 border-destructive flex flex-1 flex-col items-center space-y-3 rounded-md border p-4 text-center"
          role="alert"
        >
          <div className="relative mb-6 h-64 w-64">
            <Image
              src="/error/crashed-error-gray.svg"
              alt="Error illustration"
              fill
              className="block object-contain dark:hidden"
            />
            <Image
              src="/error/crashed-error-white.svg"
              alt="Error illustration"
              fill
              className="hidden object-contain dark:block"
            />
          </div>
          <h2 className="mb-2 text-xl font-bold">Oops! Something went wrong</h2>
          <p className="text-destructive mb-4 max-w-md font-mono text-sm">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <Button
            variant="destructive"
            onClick={this.resetError}
            aria-label="Try again"
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
