import React from 'react';

type Props = { children: React.ReactNode; onBack: () => void };
type State = { failed: boolean; detail: string; attempt: number };

/** Prevent a rendering error in the writing workspace from blanking the whole app. */
export class IdeaMapErrorBoundary extends React.Component<Props, State> {
  state: State = { failed: false, detail: '', attempt: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { failed: true, detail: error?.message || 'Không xác định' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Vườn Chữ Nở Hoa] Lỗi mở trang luyện viết:', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="mx-auto my-8 max-w-2xl rounded-2xl border border-rose-200 bg-white p-6 shadow-sm" role="alert">
        <h2 className="mb-3 text-xl font-bold text-rose-800">Chưa mở được trang luyện viết</h2>
        <p className="mb-4 text-base text-stone-700">Bài đã chọn vẫn được giữ. Cô hoặc con có thể thử mở lại hoặc quay về danh sách bài.</p>
        <details className="mb-4 rounded-xl bg-stone-50 p-3 text-sm"><summary className="cursor-pointer font-semibold">Chi tiết lỗi để gửi hỗ trợ</summary><pre className="mt-2 whitespace-pre-wrap break-words">{this.state.detail}</pre></details>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="rounded-xl bg-emerald-700 px-4 py-3 font-bold text-white" onClick={() => this.setState(s => ({ failed: false, detail: '', attempt: s.attempt + 1 }))}>Thử mở lại</button>
          <button type="button" className="rounded-xl border px-4 py-3 font-semibold" onClick={this.props.onBack}>Về danh sách bài</button>
        </div>
      </section>
    );
  }
}
