import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[OpenEnade] Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-text flex items-center justify-center">
          <div className="text-center ds-mono">
            <div className="text-2xl font-bold text-error mb-2">Erro</div>
            <p className="text-text-muted text-xs mb-4">
              Algo deu errado ao carregar esta página.
            </p>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="text-xs text-primary hover:text-text transition-colors"
            >
              &gt; voltar ao início
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
