interface InputPanelProps {
  value: string;
  onChange: (v: string) => void;
  onAnalyze: () => void;
  error: string;
  loading: boolean;
}

export default function InputPanel({
  value,
  onChange,
  onAnalyze,
  error,
  loading,
}: InputPanelProps) {
  return (
    <section className="mb-8">
      <p className="section-label">粘贴对方回复</p>
      <div className="card">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          placeholder='请粘贴对方对三句话的回复。例如："这个事情你先做起来，不要一上来就谈预算。年轻人要有格局，我们后面资源很多……"'
          className="w-full resize-none rounded-xl border border-gray-200 bg-[#FAFAF8] px-4 py-3 text-sm text-[#1F1F1F] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BFA173] focus:border-transparent transition-all leading-relaxed"
        />

        {error && (
          <p className="mt-2 text-sm text-[#B42318] flex items-center gap-1.5">
            <span>⚠</span>
            {error}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <p className="text-xs text-[#999999]">
            {value.length > 0
              ? `已输入 ${value.length} 字`
              : '建议粘贴完整的对方回复，分析结果更准确'}
          </p>
          <button
            onClick={onAnalyze}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                分析中…
              </>
            ) : (
              <>
                <span>🔍</span>
                开始验登
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
