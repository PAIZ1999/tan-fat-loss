import React from 'react';
import { FoodItem } from '../data/foodDatabase';
import { NutritionTarget, SelectedMealItem, Gender } from '../utils/calculator';

interface ExportPosterViewProps {
  id?: string;
  date: string;
  gender: Gender;
  weightKg: number;
  workoutLabel: string;
  target: NutritionTarget;
  actualTotals: { carb: number; protein: number; fat: number };
  meals: {
    breakfast: SelectedMealItem[];
    snack1: SelectedMealItem[];
    lunch: SelectedMealItem[];
    snack2: SelectedMealItem[];
    dinner: SelectedMealItem[];
  };
  foodList: FoodItem[];
  planName?: string;
}

/* ── 颜色常量 ── */
const C = {
  bg: '#090d16',
  card: '#0f172a',
  cardDeep: '#020617',
  border: '#1e293b',
  white: '#ffffff',
  t1: '#f1f5f9',
  t2: '#94a3b8',
  t3: '#64748b',
  emerald: '#34d399',
  sky: '#38bdf8',
  rose: '#fb7185',
  amber: '#fbbf24',
  indigo: '#818cf8',
  orange: '#fb923c',
};

const F = '"Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "Segoe UI", sans-serif';
const FM = '"Consolas", "Courier New", "SFMono-Regular", Menlo, monospace';

const MEALS: { key: 'breakfast' | 'snack1' | 'lunch' | 'snack2' | 'dinner'; title: string; color: string }[] = [
  { key: 'breakfast', title: '早餐', color: C.amber },
  { key: 'snack1', title: '上午加餐', color: C.rose },
  { key: 'lunch', title: '午餐', color: C.orange },
  { key: 'snack2', title: '下午加餐', color: C.emerald },
  { key: 'dinner', title: '晚餐', color: C.indigo },
];

export const ExportPosterView: React.FC<ExportPosterViewProps> = ({
  id = 'clean-poster-export-area',
  date,
  gender,
  weightKg,
  workoutLabel,
  target,
  actualTotals,
  meals,
  foodList,
  planName,
}) => {
  const aCal = Math.round(actualTotals.carb * 4 + actualTotals.protein * 4 + actualTotals.fat * 9);
  const pct = (a: number, t: number) => (t > 0 ? Math.round((a / t) * 100) : 0);
  const calP = pct(aCal, target.totalCalories);
  const carbP = pct(actualTotals.carb, target.carbGrams);
  const protP = pct(actualTotals.protein, target.proteinGrams);
  const fatP = pct(actualTotals.fat, target.fatGrams);

  const sumMeal = (items: SelectedMealItem[]) => {
    let c = 0, p = 0, f = 0;
    items.forEach((item) => {
      const food = foodList.find((fd) => fd.id === item.foodId);
      if (food) {
        const k = item.amount / (food.baseAmount || 100);
        c += (food.carbPerUnit || 0) * k;
        p += (food.proteinPerUnit || 0) * k;
        f += (food.fatPerUnit || 0) * k;
      }
    });
    return {
      carb: Math.round(c * 10) / 10,
      protein: Math.round(p * 10) / 10,
      fat: Math.round(f * 10) / 10,
    };
  };

  /* ── 进度条组件 ── */
  const Bar = ({ color, percent }: { color: string; percent: number }) => (
    <div
      style={{
        width: '100%',
        height: 5,
        backgroundColor: '#1e293b',
        borderRadius: 3,
        marginTop: 6,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: 5,
          borderRadius: 3,
          backgroundColor: color,
          width: `${Math.min(100, percent)}%`,
        }}
      />
    </div>
  );

  /* ── 宏量标签：碳蛋脂三色胶囊 (上小下大微调居中) ── */
  const MacroTag = ({ c, p, f, size = 10 }: { c: number; p: number; f: number; size?: number }) => (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: C.cardDeep,
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        padding: '2px 8px 4px 8px',
        fontFamily: FM,
        fontSize: size,
        lineHeight: 1,
      }}
    >
      <span style={{ color: C.sky }}>{c}g碳</span>
      <span style={{ color: C.t3, margin: '0 4px' }}>·</span>
      <span style={{ color: C.rose }}>{p}g蛋</span>
      <span style={{ color: C.t3, margin: '0 4px' }}>·</span>
      <span style={{ color: C.amber }}>{f}g脂</span>
    </div>
  );

  /* ── 个人档案单卡 (垂直绝对居中校准) ── */
  const ProfileCard = ({
    label,
    value,
    accent,
    valueColor,
  }: {
    label: string;
    value: string;
    accent: string;
    valueColor?: string;
  }) => (
    <div
      style={{
        backgroundColor: C.card,
        borderRadius: 10,
        border: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '8px 14px 11px 14px',
        boxSizing: 'border-box',
      }}
    >
      {/* 竖条指示线：与右侧文字中线精准平齐 */}
      <div
        style={{
          width: 4,
          height: 22,
          borderRadius: 2,
          backgroundColor: accent,
          marginRight: 10,
          flexShrink: 0,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 10, color: C.t2, lineHeight: 1, fontFamily: F }}>{label}</div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: valueColor || C.t1,
            lineHeight: 1,
            fontFamily: F,
            marginTop: 4,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );

  /* ── 营养卡片 (垂直绝对居中校准) ── */
  const NutriCard = ({
    label,
    actual,
    goal,
    unit,
    color,
    percent,
  }: {
    label: string;
    actual: number;
    goal: number;
    unit: string;
    color: string;
    percent: number;
  }) => (
    <div
      style={{
        backgroundColor: C.cardDeep,
        borderRadius: 10,
        border: `1px solid ${C.border}`,
        padding: '8px 12px 10px 12px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 3,
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, color: color, fontFamily: F, lineHeight: 1 }}>
          {label}
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: color, fontFamily: FM, lineHeight: 1 }}>
          {percent}%
        </span>
      </div>
      <div style={{ fontFamily: FM, lineHeight: 1, margin: '4px 0 2px 0' }}>
        <span style={{ fontSize: 16, fontWeight: 900, color: color }}>{actual}</span>
        <span style={{ fontSize: 10, fontWeight: 400, color: C.t3, marginLeft: 4 }}>
          / {goal}{unit}
        </span>
      </div>
      <Bar color={color} percent={percent} />
    </div>
  );

  return (
    <div
      id={id}
      style={{
        width: 700,
        fontFamily: F,
        backgroundColor: C.bg,
        color: C.t1,
        padding: 24,
        borderRadius: 16,
        border: `1px solid ${C.border}`,
        boxSizing: 'border-box',
        backgroundImage:
          'radial-gradient(at 0% 0%, rgba(16,185,129,0.07) 0px, transparent 55%), radial-gradient(at 100% 100%, rgba(59,130,246,0.04) 0px, transparent 55%)',
      }}
    >
      {/* ═══ 1. Header ═══ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: 10,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, color: C.white, lineHeight: 1, fontFamily: F }}>
            派的减脂助手 · 饮食打卡
          </div>
          <div style={{ fontSize: 11, color: C.t2, lineHeight: 1, fontFamily: F, marginTop: 5 }}>
            {planName || '生活化减脂体系 · 科学精准配餐'}
          </div>
        </div>
        <div
          style={{
            backgroundColor: C.card,
            padding: '5px 14px 7px 14px',
            borderRadius: 10,
            border: `1px solid ${C.border}`,
            textAlign: 'right',
          }}
        >
          <div style={{ fontSize: 10, color: C.t2, lineHeight: 1, fontFamily: F }}>打卡日期</div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.emerald,
              lineHeight: 1,
              fontFamily: FM,
              marginTop: 3,
            }}
          >
            {date}
          </div>
        </div>
      </div>

      {/* ═══ 2. 个人档案 (严格垂直居中，竖条与文字中线对齐) ═══ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 12 }}>
        <ProfileCard label="生理性别" value={gender === '男' ? '男士' : '女士'} accent="#60a5fa" />
        <ProfileCard
          label="当前体重"
          value={`${weightKg} kg`}
          accent={C.emerald}
          valueColor={C.emerald}
        />
        <ProfileCard label="训练频率" value={workoutLabel} accent={C.indigo} />
      </div>

      {/* ═══ 3. 营养摄入对比 ═══ */}
      <div
        style={{
          backgroundColor: C.card,
          borderRadius: 12,
          border: `1px solid ${C.border}`,
          padding: '10px 12px',
          marginTop: 12,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 6,
            borderBottom: `1px solid ${C.border}`,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, color: C.t1, fontFamily: F, lineHeight: 1 }}>
            今日营养素摄入对比
          </span>
          <span style={{ fontSize: 11, color: C.t2, fontFamily: FM, lineHeight: 1 }}>
            目标热量: <strong style={{ color: C.white }}>{target.totalCalories}</strong> kcal
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
          <NutriCard
            label="预估总热量"
            actual={aCal}
            goal={target.totalCalories}
            unit=""
            color={C.emerald}
            percent={calP}
          />
          <NutriCard
            label="碳水化合物"
            actual={actualTotals.carb}
            goal={target.carbGrams}
            unit="g"
            color={C.sky}
            percent={carbP}
          />
          <NutriCard
            label="蛋白质"
            actual={actualTotals.protein}
            goal={target.proteinGrams}
            unit="g"
            color={C.rose}
            percent={protP}
          />
          <NutriCard
            label="脂肪"
            actual={actualTotals.fat}
            goal={target.fatGrams}
            unit="g"
            color={C.amber}
            percent={fatP}
          />
        </div>
      </div>

      {/* ═══ 4. 今日食谱 (食材条目严格微调上提，绝对几何中心居中) ═══ */}
      <div style={{ marginTop: 12 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: C.t1,
            fontFamily: F,
            lineHeight: 1,
            marginBottom: 7,
          }}
        >
          今日食谱安排
        </div>

        {MEALS.map((mc) => {
          const items = meals[mc.key];
          if (items.length === 0) return null;
          const tot = sumMeal(items);

          return (
            <div
              key={mc.key}
              style={{
                backgroundColor: C.card,
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                padding: '8px 10px',
                marginBottom: 7,
                boxSizing: 'border-box',
              }}
            >
              {/* 餐卡标题：彩色圆点与标题文字绝对水平中心平齐 */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 7,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: mc.color,
                      marginRight: 6,
                      marginTop: 1,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.white,
                      fontFamily: F,
                      lineHeight: 1,
                    }}
                  >
                    {mc.title}
                  </span>
                </div>
                <MacroTag c={tot.carb} p={tot.protein} f={tot.fat} size={10} />
              </div>

              {/* 食材列表：双列，padding-top 5px, padding-bottom 8px 物理补偿基线 */}
              <div
                style={{
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 6,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 6,
                }}
              >
                {items.map((item) => {
                  const food = foodList.find((fd) => fd.id === item.foodId);
                  if (!food) return null;
                  const k = item.amount / (food.baseAmount || 100);
                  const c = Math.round((food.carbPerUnit || 0) * k * 10) / 10;
                  const p = Math.round((food.proteinPerUnit || 0) * k * 10) / 10;
                  const f = Math.round((food.fatPerUnit || 0) * k * 10) / 10;

                  return (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: C.cardDeep,
                        borderRadius: 6,
                        border: `1px solid ${C.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '5px 10px 8px 10px',
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* 食材名 */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: C.t1,
                          fontFamily: F,
                          lineHeight: 1,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {food.name}
                      </span>

                      {/* 宏量数据 + 份量 */}
                      <div style={{ display: 'flex', alignItems: 'center', lineHeight: 1 }}>
                        <span style={{ fontSize: 10, color: C.sky, fontFamily: FM, lineHeight: 1 }}>
                          {c}g碳
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: C.rose,
                            fontFamily: FM,
                            lineHeight: 1,
                            marginLeft: 4,
                          }}
                        >
                          {p}g蛋
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: C.amber,
                            fontFamily: FM,
                            lineHeight: 1,
                            marginLeft: 4,
                          }}
                        >
                          {f}g脂
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 900,
                            color: C.emerald,
                            fontFamily: FM,
                            lineHeight: 1,
                            marginLeft: 6,
                          }}
                        >
                          {item.amount}
                          <span style={{ fontSize: 9, fontWeight: 400, color: C.t2 }}>
                            {food.unit === '个' ? '个' : 'g'}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══ 5. 底部 ═══ */}
      <div
        style={{
          textAlign: 'center',
          paddingTop: 8,
          borderTop: `1px solid ${C.border}`,
          fontSize: 11,
          color: C.t3,
          fontFamily: F,
          lineHeight: 1,
        }}
      >
        谭成义生活化减脂体系 | 科学精准配餐 · 稳定制造热量缺口
      </div>
    </div>
  );
};
