import React from 'react';
import { NutritionTarget } from '../utils/calculator';
import { PieChart, Zap } from 'lucide-react';

interface DashboardProps {
  target: NutritionTarget;
  actualCarb: number;
  actualProtein: number;
  actualFat: number;
}

export const Dashboard: React.FC<DashboardProps> = ({
  target,
  actualCarb,
  actualProtein,
  actualFat,
}) => {
  const actualCalories = Math.round(actualCarb * 4 + actualProtein * 4 + actualFat * 9);

  const carbPercent = target.carbGrams > 0 ? Math.min(150, Math.round((actualCarb / target.carbGrams) * 100)) : 0;
  const proteinPercent = target.proteinGrams > 0 ? Math.min(150, Math.round((actualProtein / target.proteinGrams) * 100)) : 0;
  const fatPercent = target.fatGrams > 0 ? Math.min(150, Math.round((actualFat / target.fatGrams) * 100)) : 0;
  const calPercent = target.totalCalories > 0 ? Math.min(150, Math.round((actualCalories / target.totalCalories) * 100)) : 0;

  return (
    <div className="glass-card rounded-xl p-3 mb-2.5 border border-slate-800/80">
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs sm:text-sm font-bold text-slate-100">
            今日营养素摄入对比
          </h2>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>目标热量: <strong className="text-slate-100 font-mono">{target.totalCalories}</strong> kcal</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {/* 热量 */}
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[11px] text-slate-400 mb-0.5">预估总热量</div>
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-lg sm:text-xl font-black text-white font-mono">{actualCalories}</span>
            <span className="text-[10px] text-slate-500 font-mono">/ {target.totalCalories} kcal</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, calPercent)}%` }} />
          </div>
        </div>

        {/* 碳水 */}
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-[11px] text-slate-400 mb-0.5">
            <span className="font-bold text-sky-400">碳水化合物</span>
            <span className="font-mono text-xs text-sky-400 font-bold">{carbPercent}%</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-lg sm:text-xl font-black text-sky-400 font-mono">{actualCarb}</span>
            <span className="text-[10px] text-slate-500 font-mono">/ {target.carbGrams}g</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, carbPercent)}%` }} />
          </div>
        </div>

        {/* 蛋白质 */}
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-[11px] text-slate-400 mb-0.5">
            <span className="font-bold text-rose-400">蛋白质</span>
            <span className="font-mono text-xs text-rose-400 font-bold">{proteinPercent}%</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-lg sm:text-xl font-black text-rose-400 font-mono">{actualProtein}</span>
            <span className="text-[10px] text-slate-500 font-mono">/ {target.proteinGrams}g</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, proteinPercent)}%` }} />
          </div>
        </div>

        {/* 脂肪 */}
        <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-[11px] text-slate-400 mb-0.5">
            <span className="font-bold text-amber-400">脂肪</span>
            <span className="font-mono text-xs text-amber-400 font-bold">{fatPercent}%</span>
          </div>
          <div className="flex items-baseline gap-1 mb-1.5">
            <span className="text-lg sm:text-xl font-black text-amber-400 font-mono">{actualFat}</span>
            <span className="text-[10px] text-slate-500 font-mono">/ {target.fatGrams}g</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, fatPercent)}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

