import { useState, useRef } from 'react';
import { analyzeText, AnalysisResult } from './lib/scoring';
import QuestionCards from './components/QuestionCards';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import ShareCard from './components/ShareCard';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  function handleAnalyze() {
    if (!inputText.trim()) {
      setError('先粘贴对方回复，再开始验登。');
      return;
    }
    setError('');
    setLoading(true);

    // 模拟轻微延迟，增加仪式感
    setTimeout(() => {
      const res = analyzeText(inputText);
      setResult(res);
      setLoading(false);

      // 滚动到结果区
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 600);
  }

  function handleReset() {
    setInputText('');
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-[#F7F6F1]">
      {/* ══════════════ HEADER ══════════════ */}
      <header className="border-b border-[#E8E4DC] bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <span className="font-black text-[#1F1F1F] tracking-tight text-base sm:text-lg">
              三句话验登
            </span>
          </div>
          <span className="text-xs text-[#999999] hidden sm:block">
            合作前先问三句话，含登量一秒现形
          </span>
          {result && (
            <button
              onClick={handleReset}
              className="text-xs text-[#666666] hover:text-[#1F1F1F] transition-colors px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              重新验登
            </button>
          )}
        </div>
      </header>

      <main className="max-w-[960px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ══════════════ HERO ══════════════ */}
        <section className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-[#BFA173]/10 border border-[#BFA173]/30 text-[#BFA173] text-xs font-semibold px-3 py-1 rounded-full mb-4">
            ✦ 职场自保工具
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#1F1F1F] tracking-tight leading-tight mb-3">
            三句话验登
          </h1>
          <p className="text-lg sm:text-xl text-[#BFA173] font-semibold mb-4">
            合作前先问三句话，含登量一秒现形。
          </p>
          <p className="text-sm sm:text-base text-[#666666] leading-relaxed max-w-2xl">
            对外合作时，真正危险的人往往不会一开始暴露。他们可能会说
            <span className="text-[#B42318] font-medium">「你先做起来」</span>
            <span className="text-[#B42318] font-medium">「年轻人不要太计较」</span>
            <span className="text-[#B42318] font-medium">「以后资源很多」</span>。
            <br className="hidden sm:block" />
            「三句话验登」帮你在投入时间、资源和情绪之前，先看清对方的合作方式。
          </p>
        </section>

        {/* ══════════════ 三句话卡片 ══════════════ */}
        <QuestionCards />

        {/* ══════════════ 输入区 ══════════════ */}
        <InputPanel
          value={inputText}
          onChange={setInputText}
          onAnalyze={handleAnalyze}
          error={error}
          loading={loading}
        />

        {/* ══════════════ 结果区 ══════════════ */}
        {result && (
          <div ref={resultRef} className="space-y-6">
            {/* 分割线 */}
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-[#E8E4DC]" />
              <span className="text-xs text-[#BFA173] font-semibold px-2">验登报告</span>
              <div className="flex-1 h-px bg-[#E8E4DC]" />
            </div>

            <ResultPanel result={result} />
            <ShareCard result={result} inputText={inputText} />

            {/* 重新验登按钮 */}
            <div className="text-center pt-4 pb-8">
              <button
                onClick={handleReset}
                className="text-sm text-[#666666] hover:text-[#1F1F1F] transition-colors underline underline-offset-2"
              >
                换一段话，重新验登 →
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="border-t border-[#E8E4DC] mt-4 py-6">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-[#999999]">
            三句话验登 · 纯前端工具，输入内容不上传不存储
          </p>
          <p className="text-xs text-[#CCCCCC] mt-1">
            本工具基于语言模式分析，仅供参考，不构成法律或职场建议
          </p>
        </div>
      </footer>
    </div>
  );
}
