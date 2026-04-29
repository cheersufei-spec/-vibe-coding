const questions = [
  {
    number: '01',
    label: '测目标',
    title: '这次合作你最希望达成的具体结果是什么？我们怎么判断它算成功？',
    tip: '看对方是否有清晰的目标意识和验收标准',
  },
  {
    number: '02',
    label: '测边界',
    title: '这件事双方分别投入什么资源？我的交付范围、时间周期和预算边界可以先确认一下吗？',
    tip: '看对方是否尊重你的边界，愿意明确分工',
  },
  {
    number: '03',
    label: '测责任',
    title: '如果中途需求变化，或者结果没有达到预期，我们怎么调整？责任和成本怎么分担？',
    tip: '看对方面对不确定性时是否愿意共担责任',
  },
];

export default function QuestionCards() {
  return (
    <section className="mb-8">
      <p className="section-label">三句话脚本</p>
      <div className="grid gap-4 sm:grid-cols-3">
        {questions.map((q) => (
          <div
            key={q.number}
            className="card relative overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* 背景大数字装饰 */}
            <span className="absolute top-3 right-4 text-7xl font-black text-gray-50 select-none leading-none">
              {q.number}
            </span>

            <div className="relative z-10">
              <span className="inline-block bg-[#BFA173] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3">
                {q.label}
              </span>
              <p className="text-[#1F1F1F] text-sm leading-relaxed font-medium mb-3">
                {q.title}
              </p>
              <p className="text-[#999999] text-xs leading-relaxed border-t border-gray-50 pt-3">
                {q.tip}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
