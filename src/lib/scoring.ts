// ============================================================
// scoring.ts — 三句话验登 核心评分引擎
// ============================================================

export type RiskCategory =
  | "白嫖画饼"
  | "打压PUA"
  | "边界模糊"
  | "责任转嫁"
  | "权力压迫";

export type AnalysisResult = {
  score: number;
  level: string;
  title: string;
  advice: string;
  reply: string;
  riskTags: string[];
  riskHits: Record<RiskCategory, string[]>;
  greenHits: string[];
  explanation: string;
};

// ──────────────────────────────────────────────
// 风险词库
// ──────────────────────────────────────────────
const RISK_KEYWORDS: Record<RiskCategory, string[]> = {
  白嫖画饼: [
    "先做起来",
    "以后资源",
    "长期价值",
    "不会亏待你",
    "给你机会",
    "资源很多",
    "先帮忙",
    "免费",
    "置换",
    "曝光",
    "后面合作",
    "先试试",
    "先支持一下",
  ],
  打压PUA: [
    "年轻人",
    "格局",
    "别计较",
    "太功利",
    "太敏感",
    "你不懂",
    "态度不对",
    "不成熟",
    "吃亏是福",
    "多做点没坏处",
    "你还年轻",
    "不要这么现实",
    "别那么计较",
  ],
  边界模糊: [
    "看情况",
    "到时候再说",
    "差不多",
    "不用这么细",
    "不用写",
    "信任最重要",
    "没必要合同",
    "先别谈预算",
    "流程不用那么复杂",
    "不用这么正式",
    "后面再定",
  ],
  责任转嫁: [
    "结果不好就是执行问题",
    "我要的是结果",
    "不看过程",
    "你们自己想办法",
    "这是你的能力问题",
    "别找理由",
    "我只看结果",
    "结果没出来就没有意义",
    "你们要对结果负责",
  ],
  权力压迫: [
    "我认识很多人",
    "我给你背书",
    "这个圈子很小",
    "你以后还要发展",
    "别把关系搞僵",
    "你知道我是谁吗",
    "我见过很多你这样的人",
    "你这个阶段应该多学习",
  ],
};

// ──────────────────────────────────────────────
// 正向合作词库
// ──────────────────────────────────────────────
const GREEN_KEYWORDS: string[] = [
  "预算",
  "合同",
  "交付",
  "边界",
  "时间周期",
  "里程碑",
  "双方",
  "责任",
  "确认",
  "书面",
  "付款",
  "报价",
  "需求变化",
  "复盘",
  "调整机制",
  "资源投入",
  "成功标准",
  "验收",
  "权益",
  "发票",
  "排期",
  "对齐",
];

// ──────────────────────────────────────────────
// 风险人格标签映射
// ──────────────────────────────────────────────
const RISK_TAG_MAP: Record<RiskCategory, string> = {
  白嫖画饼: "画饼型老登",
  打压PUA: "爹味型老登",
  边界模糊: "糊弄型老登",
  责任转嫁: "甩锅型老登",
  权力压迫: "压迫型老登",
};

// ──────────────────────────────────────────────
// 风险等级配置
// ──────────────────────────────────────────────
type LevelConfig = {
  level: string;
  title: string;
  advice: string;
};

function getLevelConfig(score: number): LevelConfig {
  if (score <= 20) {
    return {
      level: "低含登量",
      title: "清爽合作者",
      advice:
        "可以继续推进，但关键事项依然建议书面确认。",
    };
  }
  if (score <= 45) {
    return {
      level: "轻微含登",
      title: "有点爹味，但暂时可控",
      advice:
        "可以继续聊，但要尽快确认预算、交付和责任边界。",
    };
  }
  if (score <= 70) {
    return {
      level: "中高含登",
      title: "合作风险明显",
      advice:
        "建议降低投入，只接受书面确认后的合作。不要被画饼带节奏。",
    };
  }
  return {
    level: "高含登量",
    title: "红灯老登",
    advice:
      "建议停止深度投入。对方大概率会白嫖、打压或事后改口。",
  };
}

// ──────────────────────────────────────────────
// 建议回复话术
// ──────────────────────────────────────────────
function getReply(score: number): string {
  if (score <= 20) {
    return "感谢你的说明，我这边可以基于目前信息继续推进。我们把目标、分工和时间节点简单同步成文字，后续执行会更高效。";
  }
  if (score <= 45) {
    return "我理解这件事有长期价值。为了保证双方投入都有效，我建议我们先把交付范围、预算边界和时间节点确认一下。";
  }
  if (score <= 70) {
    return "我愿意继续了解，但在正式投入前，需要先明确目标、交付范围、预算和责任机制。这样对双方都更稳妥。";
  }
  return "感谢你的邀请。基于目前沟通方式和合作边界，我判断这次暂时不适合继续推进。祝项目顺利。";
}

// ──────────────────────────────────────────────
// 风险解释文案生成
// ──────────────────────────────────────────────
function buildExplanation(
  score: number,
  riskTags: string[],
  hitCategories: RiskCategory[]
): string {
  if (score <= 20) {
    return "对方回复中包含较多清晰的合作信号，边界意识良好，整体合作风险较低。";
  }
  if (hitCategories.length === 0) {
    return "文本较短或信息不足，暂无明显风险词命中，但缺乏正向合作信号，建议进一步沟通确认。";
  }
  const tagStr = riskTags.join("、");
  const catStr = hitCategories.join("、");
  return `检测到 ${hitCategories.length} 类风险模式（${catStr}），人格画像倾向：${tagStr}。对方在沟通中存在回避边界、转移责任或打压谈判的典型话术特征，建议在正式合作前要求书面确认关键事项。`;
}

// ──────────────────────────────────────────────
// 主评分函数
// ──────────────────────────────────────────────
export function analyzeText(text: string): AnalysisResult {
  const trimmed = text.trim();

  // —— 命中风险词 ——
  const riskHits: Record<RiskCategory, string[]> = {
    白嫖画饼: [],
    打压PUA: [],
    边界模糊: [],
    责任转嫁: [],
    权力压迫: [],
  };

  let riskScore = 0;

  for (const [category, keywords] of Object.entries(RISK_KEYWORDS) as [
    RiskCategory,
    string[]
  ][]) {
    for (const kw of keywords) {
      if (trimmed.includes(kw)) {
        if (!riskHits[category].includes(kw)) {
          riskHits[category].push(kw);
          riskScore += 10;
        }
      }
    }
  }

  // —— 命中正向词 ——
  const greenHits: string[] = [];
  let greenScore = 0;

  for (const kw of GREEN_KEYWORDS) {
    if (trimmed.includes(kw)) {
      greenHits.push(kw);
      greenScore += 5;
    }
  }

  // —— 初始分数 10 ——
  let score = 10 + riskScore - greenScore;

  // —— 文本过短且无正向词 ——
  const chineseCharCount = (trimmed.match(/[\u4e00-\u9fa5]/g) || []).length;
  if (chineseCharCount < 80 && greenHits.length === 0) {
    score += 15;
  }

  // —— 命中 3 类及以上风险分类 ——
  const hitCategories = (
    Object.keys(riskHits) as RiskCategory[]
  ).filter((cat) => riskHits[cat].length > 0);

  if (hitCategories.length >= 3) {
    score += 10;
  }

  // —— 年轻人 + 格局 同时命中 ——
  if (trimmed.includes("年轻人") && trimmed.includes("格局")) {
    score += 10;
  }

  // —— 先做起来 + 预算回避 同时命中 ——
  const budgetAvoidance = ["先别谈预算", "不用这么细", "到时候再说", "后面再定", "看情况"];
  const hasBudgetAvoidance = budgetAvoidance.some((kw) => trimmed.includes(kw));
  if (trimmed.includes("先做起来") && hasBudgetAvoidance) {
    score += 10;
  }

  // —— 分数限制 0-100 ——
  score = Math.max(0, Math.min(100, score));

  // —— 风险人格标签 ——
  const riskTags: string[] =
    hitCategories.length > 0
      ? hitCategories.map((cat) => RISK_TAG_MAP[cat])
      : ["正常合作型"];

  // —— 等级、建议、话术 ——
  const { level, title, advice } = getLevelConfig(score);
  const reply = getReply(score);
  const explanation = buildExplanation(score, riskTags, hitCategories);

  return {
    score,
    level,
    title,
    advice,
    reply,
    riskTags,
    riskHits,
    greenHits,
    explanation,
  };
}
