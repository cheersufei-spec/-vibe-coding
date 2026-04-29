import { AnalysisResult } from '../lib/scoring';

interface ShareCardProps {
  result: AnalysisResult;
  inputText: string;
}

export default function ShareCard({ result, inputText }: ShareCardProps) {
  const { score, title, level, riskTags, advice, reply } = result;

  const levelColor =
    score <= 20
      ? '#027A48'
      : score <= 45
      ? '#B54708'
      : score <= 70
      ? '#B54708'
      : '#B42318';

  const levelBg =
    score <= 20
      ? 'from-emerald-50 to-green-50'
      : score <= 45
      ? 'from-amber-50 to-yellow-50'
      : score <= 70
      ? 'from-orange-50 to-amber-50'
      : 'from-red-50 to-rose-50';

  const scoreEmoji =
    score <= 20 ? '✅' : score <= 45 ? '⚠️' : score <= 70 ? '🚨' : '🔴';

  // 截断输入文本用于展示
  const previewText =
    inputText.length > 80 ? inputText.slice(0, 80) + '…' : inputText;

  return (
    <div className="card fade-up fade-up-delay-5">
      <p className="section-label">分享卡片</p>

      {/* 卡片主体 */}
      <div
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${levelBg} border border-gray-100 p-6`}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-current -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-current translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-black text-[#1F1F1F] tracking-tight">
                三句话验登报告
              </h3>
              <p className="text-xs text-[#999999] mt-0.5">sanjihua-yandeng.app</p>
            </div>
            <span className="text-2xl">{scoreEmoji}</span>
          </div>

          {/* 分数 + 等级 */}
          <div className="flex items-baseline gap-3 mb-3">
            <span
              className="text-5xl font-black leading-none"
              style={{ color: levelColor }}
            >
              {score}
            </span>
            <div className="flex flex-col">
              <span className="text-xs text-[#999999] leading-none mb-1">含登量 / 100</span>
              <span
                className="text-sm font-bold"
                style={{ color: levelColor }}
              >
                {level}
              </span>
            </div>
          </div>

          {/* 风险人格 */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs text-[#666666]">风险人格：</span>
            {riskTags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: tag === '正常合作型' ? '#dcfce7' : '#fee2e2',
                  color: tag === '正常合作型' ? '#027A48' : '#B42318',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 判定 */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 mb-4">
            <p className="text-sm font-semibold text-[#1F1F1F] mb-1">
              {title}
            </p>
            <p className="text-xs text-[#666666] leading-relaxed">{advice}</p>
          </div>

          {/* 原文预览 */}
          {previewText && (
            <div className="mb-4">
              <p className="text-xs text-[#999999] mb-1">对方原文节选：</p>
              <p className="text-xs text-[#666666] bg-white/50 rounded-lg px-3 py-2 italic leading-relaxed border border-white/80">
                "{previewText}"
              </p>
            </div>
          )}

          {/* 结论 & 话术 */}
          <div className="border-t border-white/60 pt-3">
            <p className="text-xs text-[#999999] mb-1.5">建议回复：</p>
            <p className="text-xs text-[#1F1F1F] leading-relaxed">
              {reply}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-white/60 flex items-center justify-between">
            <p className="text-xs text-[#BFA173] font-semibold">
              🔍 合作前先问三句话，含登量一秒现形
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-[#999999] text-center">
        截图分享给朋友 · 让更多人少踩坑
      </p>
    </div>
  );
}
