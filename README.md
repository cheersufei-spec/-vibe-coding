# 朋友圈写作助手（Web 版）

这是一个可直接运行的静态网页版本，已整合：

- 母 Prompt（system/developer 层）
- RAG 检索 Prompt（query rewriter + context pack）
- 最终生成 Prompt
- 输出 JSON Schema

## 快速开始

```bash
python3 -m http.server 4173
```

浏览器打开：

- `http://localhost:4173`

## 使用步骤

1. 在页面填入 OpenAI 兼容接口配置（Base URL / API Key / Model）。
2. 填写用户输入（场景、语气、长度、主题碎片）。
3. 粘贴你的向量检索结果 JSON（可选）。
4. 点击“生成 memory_pack（本地规则打包）”。
5. 点击“调用模型生成 4 版本文案”。
6. 在下方查看渲染卡片或复制 JSON。

## 说明

- 页面会把输入保存到浏览器 LocalStorage，刷新不会丢。
- 若你已有后端，可把当前页面作为前端原型，直接替换 `chatCompletion` 调用即可。
