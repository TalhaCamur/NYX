import React, { ReactNode, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import './index.css';

interface Props {
  children?: ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
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
        <div style={{ padding: '2rem', color: 'white', backgroundColor: '#111', height: '100vh', fontFamily: 'sans-serif' }}>
          <h1 style={{ fontSize: '2rem', color: '#db2777' }}>Application Error</h1>
          <p>Something went wrong, and the application could not be rendered.</p>
          <details style={{ marginTop: '1rem', background: '#1D1D1D', padding: '1rem', borderRadius: '8px' }}>
            <summary>Error Details</summary>
            <pre style={{ color: 'red', whiteSpace: 'pre-wrap', marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
