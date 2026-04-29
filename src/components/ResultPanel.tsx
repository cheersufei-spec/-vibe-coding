import { AnalysisResult, RiskCategory } from '../lib/scoring';
import Badge from './Badge';

interface ResultPanelProps {
  result: AnalysisResult;
}

function ScoreDisplay({ score }: { score: number }) {
  const ringColor =
    score <= 20
      ? '#027A48'
      : score <= 45
      ? '#BFA173'
      : score <= 70
      ? '#B54708'
      : '#B42318';

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#F0EDE6" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-black leading-none" style={{ color: ringColor }}>
          {score}
        </span>
        <span className="text-xs text-[#999999] mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

const RISK_CATEGORY_LABELS: Record<RiskCategory, { emoji: string; label: string }> = {
  白嫖画饼: { emoji: '🎪', label: '白嫖 / 画饼' },
  打压PUA: { emoji: '👴', label: '打压 / PUA' },
  边界模糊: { emoji: '🌫️', label: '边界模糊' },
  责任转嫁: { emoji: '🪃', label: '责任转嫁' },
  权力压迫: { emoji: '⚡', label: '权力压迫' },
};

export default function ResultPanel({ result }: ResultPanelProps) {
  const {
    score,
    level,
    title,
    advice,
    reply,
    riskTags,
    riskHits,
    greenHits,
    explanation,
  } = result;

  const levelColor =
    score <= 20
      ? 'text-[#027A48]'
      : score <= 45
      ? 'text-[#B54708]'
      : score <= 70
      ? 'text-[#B54708]'
      : 'text-[#B42318]';

  const levelBg =
    score <= 20
      ? 'bg-emerald-50 border-emerald-100'
      : score <= 45
      ? 'bg-amber-50 border-amber-100'
      : score <= 70
      ? 'bg-orange-50 border-orange-100'
      : 'bg-red-50 border-red-100';

  const hitCategories = (Object.keys(riskHits) as RiskCategory[]).filter(
    (cat) => riskHits[cat].length > 0
  );

  return (
    <div className="space-y-5">
      {/* ── 总览卡片 ── */}
      <div className={`card border ${levelBg} fade-up`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* 分数环 */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <ScoreDisplay score={score} />
            <span className={`text-xs font-semibold ${levelColor}`}>含登量</span>
          </div>

          {/* 等级信息 */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-2xl font-black ${levelColor}`}>{title}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${levelBg} ${levelColor}`}>
                {level}
              </span>
            </div>
            <p className="text-sm text-[#666666] leading-relaxed mb-3">{explanation}</p>

            {/* 风险人格标签 */}
            <div className="flex flex-wrap gap-2">
              {riskTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={tag === '正常合作型' ? 'green' : 'risk'}
                >
                  {tag === '正常合作型' ? '✓ ' : '⚑ '}
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 命中的风险信号 ── */}
      {hitCategories.length > 0 && (
        <div className="card fade-up fade-up-delay-1">
          <p className="section-label">命中风险话术</p>
          <div className="space-y-3">
            {hitCategories.map((cat) => {
              const meta = RISK_CATEGORY_LABELS[cat];
              return (
                <div key={cat} className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{meta.emoji}</span>
                    <span className="text-sm font-semibold text-[#B42318]">{meta.label}</span>
                    <span className="ml-auto text-xs text-[#B42318] opacity-60">
                      命中 {riskHits[cat].length} 个
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {riskHits[cat].map((kw) => (
                      <span
                        key={kw}
                        className="bg-white text-[#B42318] text-xs font-medium px-2 py-0.5 rounded-md border border-red-200"
                      >
                        「{kw}」
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 正向合作信号 ── */}
      <div className="card fade-up fade-up-delay-2">
        <p className="section-label">正向合作信号</p>
        {greenHits.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {greenHits.map((kw) => (
              <Badge key={kw} variant="green" size="sm">
                ✓ {kw}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#999999] flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            未检测到正向合作信号。对方回复中缺乏预算、合同、边界等健康合作关键词。
          </p>
        )}
      </div>

      {/* ── 建议动作 ── */}
      <div className="card fade-up fade-up-delay-3">
        <p className="section-label">建议动作</p>
        <div className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#BFA173] text-white flex items-center justify-center text-sm font-bold">
            →
          </span>
          <p className="text-sm text-[#1F1F1F] leading-relaxed pt-1">{advice}</p>
        </div>
      </div>

      {/* ── 建议回复话术 ── */}
      <div className="card fade-up fade-up-delay-4">
        <p className="section-label">体面反击话术</p>
        <div className="relative bg-[#FAFAF8] rounded-xl border border-gray-100 px-4 py-4">
          {/* 引号装饰 */}
          <span className="absolute top-2 left-3 text-4xl text-[#BFA173] opacity-20 font-serif leading-none select-none">
            "
          </span>
          <p className="text-sm text-[#1F1F1F] leading-relaxed pl-4 italic">
            {reply}
          </p>
        </div>
        <p className="mt-2 text-xs text-[#999999]">
          💡 可直接复制发送，语气中立但边界清晰
        </p>
      </div>
    </div>
  );
}
