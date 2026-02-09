const $ = (id) => document.getElementById(id);

const stateKeys = ["baseUrl", "model", "apiKey", "scene", "tone", "lengthPref", "userInput", "rewrittenQueries", "retrievalResults", "memoryPack", "outputJson"];
stateKeys.forEach((k) => {
  const el = $(k);
  const stored = localStorage.getItem(`fcw.${k}`);
  if (stored && el) el.value = stored;
  el?.addEventListener("input", () => localStorage.setItem(`fcw.${k}`, el.value));
});

function safeJsonParse(text, fallback) {
  try { return JSON.parse(text); } catch { return fallback; }
}

function packMemoryLocally(retrievalResults, userInput) {
  const priorities = ["Style Rules", "Recent", "Entities", "Templates", "Post Archive"];
  const normalized = [...retrievalResults]
    .filter((x) => x && typeof x === "object")
    .sort((a, b) => priorities.indexOf(a.type) - priorities.indexOf(b.type));

  const keywords = (userInput || "").toLowerCase().split(/\s+/).filter(Boolean);
  const selected = [];
  for (const item of normalized) {
    if (selected.length >= 12) break;
    const text = `${item.title || ""} ${item.content || ""}`.toLowerCase();
    const hit = keywords.length === 0 || keywords.some((k) => text.includes(k));
    if (!hit) continue;
    selected.push({
      id: item.id || crypto.randomUUID(),
      type: item.type || "Unknown",
      summary: String(item.content || "").slice(0, 120),
      privacy_level: item.privacy_level || "default",
      date: item.date || "",
      tags: Array.isArray(item.tags) ? item.tags : []
    });
  }

  return { memory_pack: selected };
}

async function chatCompletion({ baseUrl, apiKey, model, systemPrompt, userPrompt }) {
  const url = `${baseUrl.replace(/\/$/, "")}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API ${res.status}: ${detail}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("模型无返回内容");
  return content;
}

function renderVariants(output) {
  const root = $("rendered");
  root.innerHTML = "";
  if (!Array.isArray(output?.variants)) return;

  for (const v of output.variants) {
    const tpl = $("variantTpl").content.cloneNode(true);
    tpl.querySelector("h3").textContent = `${v.title || v.id || "未命名"}`;
    tpl.querySelector(".variant-text").textContent = v.text || "";
    tpl.querySelector(".chips").textContent = [
      ...(v.emoji_suggestion || []).map((e) => `emoji:${e}`),
      ...(v.replace_suggestions || []).map((r) => `替换建议:${r}`)
    ].join(" · ");
    root.appendChild(tpl);
  }
}

async function loadPrompt(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`加载 prompt 失败: ${path}`);
  return res.text();
}


$("btnRewriteQueries").addEventListener("click", async () => {
  try {
    const [systemPrompt, queryRewriterPrompt] = await Promise.all([
      loadPrompt("./prompts/system_prompt.txt"),
      loadPrompt("./prompts/query_rewriter_prompt.txt")
    ]);

    const userPrompt = `${queryRewriterPrompt}\n\n用户输入：${$("userInput").value}\n场景：${$("scene").value}；语气：${$("tone").value}；长度偏好：${$("lengthPref").value}`;
    const content = await chatCompletion({
      baseUrl: $("baseUrl").value,
      apiKey: $("apiKey").value,
      model: $("model").value,
      systemPrompt,
      userPrompt
    });

    const parsed = safeJsonParse(content, null);
    if (!parsed) throw new Error("query rewriter 返回不是合法 JSON");
    $("rewrittenQueries").value = JSON.stringify(parsed, null, 2);
    localStorage.setItem("fcw.rewrittenQueries", $("rewrittenQueries").value);
  } catch (err) {
    alert(err.message);
  }
});

$("btnPackMemoryByModel").addEventListener("click", async () => {
  try {
    const [systemPrompt, contextPackPrompt] = await Promise.all([
      loadPrompt("./prompts/system_prompt.txt"),
      loadPrompt("./prompts/context_pack_prompt.txt")
    ]);

    const retrieval = safeJsonParse($("retrievalResults").value, []);
    const userPrompt = `${contextPackPrompt}\n\n本次用户输入：${$("userInput").value}\n\n检索结果：\n${JSON.stringify(retrieval, null, 2)}`;

    const content = await chatCompletion({
      baseUrl: $("baseUrl").value,
      apiKey: $("apiKey").value,
      model: $("model").value,
      systemPrompt,
      userPrompt
    });

    const parsed = safeJsonParse(content, null);
    if (!parsed || !parsed.memory_pack) throw new Error("context pack 返回结构不正确");
    $("memoryPack").value = JSON.stringify(parsed, null, 2);
    localStorage.setItem("fcw.memoryPack", $("memoryPack").value);
  } catch (err) {
    alert(err.message);
  }
});

$("btnPackMemory").addEventListener("click", () => {
  const retrieval = safeJsonParse($("retrievalResults").value, []);
  const packed = packMemoryLocally(retrieval, $("userInput").value);
  $("memoryPack").value = JSON.stringify(packed, null, 2);
  localStorage.setItem("fcw.memoryPack", $("memoryPack").value);
});

$("btnGenerate").addEventListener("click", async () => {
  try {
    const [systemPrompt, finalGeneratorPrompt] = await Promise.all([
      loadPrompt("./prompts/system_prompt.txt"),
      loadPrompt("./prompts/final_generator_prompt.txt")
    ]);

    const payload = {
      user_input: {
        scene: $("scene").value,
        tone: $("tone").value,
        length_pref: $("lengthPref").value,
        content: $("userInput").value
      },
      memory_pack: safeJsonParse($("memoryPack").value, { memory_pack: [] })
    };

    const userPrompt = `${finalGeneratorPrompt}\n\n以下是本次输入JSON：\n${JSON.stringify(payload, null, 2)}\n\n请严格输出JSON。`;

    const content = await chatCompletion({
      baseUrl: $("baseUrl").value,
      apiKey: $("apiKey").value,
      model: $("model").value,
      systemPrompt,
      userPrompt
    });

    const parsed = safeJsonParse(content, null);
    if (!parsed) throw new Error("模型返回不是合法 JSON，请检查模型兼容性或重试。");

    $("outputJson").value = JSON.stringify(parsed, null, 2);
    localStorage.setItem("fcw.outputJson", $("outputJson").value);
    renderVariants(parsed);
  } catch (err) {
    alert(err.message);
  }
});

$("btnCopyJson").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("outputJson").value);
    alert("JSON 已复制");
  } catch {
    alert("复制失败，请手动复制");
  }
});

const initialOutput = safeJsonParse($("outputJson").value, null);
if (initialOutput) renderVariants(initialOutput);
