import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, info);
  }

  handleReset = () => {
    (this as unknown as Component<Props, State>).setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-6 text-center"
          dir="rtl"
        >
          <div className="max-w-sm space-y-4 bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h1 className="text-lg font-bold text-white">مشکلی پیش آمد</h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              برنامه با خطای غیرمنتظره‌ای مواجه شد. اطلاعات شما محفوظ است؛ لطفاً صفحه را دوباره بارگذاری کنید.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-500/25"
            >
              بارگذاری مجدد برنامه
            </button>
          </div>
        </div>
      );
    }
    return (this as unknown as { props: Props }).props.children;
  }
}
