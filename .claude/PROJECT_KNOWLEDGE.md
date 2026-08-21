# 减脂助手项目知识库 (PROJECT_KNOWLEDGE.md)

## 📌 架构与计算模块规范

### 1. 智能自动配餐逻辑 (`src/utils/autoPlanner.ts`)
- **计算单位约定**：
  - 食物单位分为 `'100g'` 与 `'个'`。
  - 对于 `'100g'` 类食物，`carbPerUnit`, `proteinPerUnit`, `fatPerUnit` 记录的是 **每100g** 中该营养素的克数。
  - 要计算目标营养素克数 $N$ 所需的食物克数 $G$，公式为：
    $$G = \text{Math.round}\left(\frac{N}{\text{food.nutrientPerUnit}} \times \text{food.baseAmount}\right)$$
  - **切勿**先除以 $0.6$ 后又乘以 $100$，这会导致放大 100 倍严重算错！
- **食物查找降级保护**：
  - 使用 `getFood(foodList, preferredId, categoryFallback)`。当指定食品 ID 不存在时，降级查找同 Category 的食物，避免全量退化到燕麦 (`foodList[0]`)。

### 2. UI 紧凑度与自适应高度规范 (`MealPlanner.tsx` & `App.tsx`)
- **统一最大宽度**：`max-w-[1440px] mx-auto px-4 sm:px-6`
- **两栏顶端与底端精准对齐**：
  - 左侧 `lg:col-span-7` 与右侧 `lg:col-span-5` 均采用 Flexbox 自适应高。
  - 顶部设置相同高度的 `h-7 mb-2` Header 标题/控制区域。
  - 右侧食材选择卡片内部列表使用 `flex-1 h-0 overflow-y-auto` 独立滚动，拉伸充满屏幕剩余空间，保证右侧底边与左侧晚餐卡片精准 100% 平行平齐。
- **单位显示**：
  - 食物数量输入框旁边的单位文本应为：`food.unit === '个' ? '个' : 'g'`。
