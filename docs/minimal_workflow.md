# 朋友圈写作助手最小落地流程

1. 用户输入（主题/碎片 + 选项）
2. Query Rewriter 生成四类 queries
3. 向量库分别检索（style/recent/entities/templates/posts）
4. Context Pack 打包成 `memory_pack`（最多12条）
5. Final Generator 产出 JSON（4版本）
6. 用户选中一条 → 可选写回知识库（post archive + tags + used_memory_ids）
