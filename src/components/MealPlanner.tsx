import React, { useState, useRef, useEffect } from 'react';
import { FoodItem } from '../data/foodDatabase';
import { SelectedMealItem } from '../utils/calculator';
import { AutoPlanMode } from '../utils/autoPlanner';
import {
  Plus,
  Trash2,
  Search,
  Utensils,
  Sparkles,
  Shuffle,
  Sunrise,
  Coffee,
  Sun,
  Activity,
  Moon,
} from 'lucide-react';

interface MealPlannerProps {
  foodList: FoodItem[];
  meals: {
    breakfast: SelectedMealItem[];
    snack1: SelectedMealItem[];
    lunch: SelectedMealItem[];
    snack2: SelectedMealItem[];
    dinner: SelectedMealItem[];
  };
  activeMode: AutoPlanMode;
  onUpdateMeal: (mealKey: keyof MealPlannerProps['meals'], items: SelectedMealItem[]) => void;
  onAutoPlan: (mode: AutoPlanMode) => void;
  onShuffleVariant: () => void;
}

export const MealPlanner: React.FC<MealPlannerProps> = ({
  foodList,
  meals,
  activeMode,
  onUpdateMeal,
  onAutoPlan,
  onShuffleVariant,
}) => {
  const [activeMealKey, setActiveMealKey] = useState<keyof MealPlannerProps['meals']>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const leftColRef = useRef<HTMLDivElement>(null);
  const [leftHeight, setLeftHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth >= 1024 && leftColRef.current) {
        setLeftHeight(leftColRef.current.offsetHeight);
      } else {
        setLeftHeight(undefined);
      }
    };

    updateHeight();

    if (!leftColRef.current) return;
    const observer = new ResizeObserver(() => {
      updateHeight();
    });
    observer.observe(leftColRef.current);
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, [meals]);

  const mealConfigs: {
    key: keyof MealPlannerProps['meals'];
    title: string;
    Icon: React.ElementType;
    color: string;
  }[] = [
    { key: 'breakfast', title: '早餐', Icon: Sunrise, color: 'text-amber-400' },
    { key: 'snack1', title: '上午加餐', Icon: Coffee, color: 'text-rose-400' },
    { key: 'lunch', title: '午餐', Icon: Sun, color: 'text-orange-400' },
    { key: 'snack2', title: '下午加餐', Icon: Activity, color: 'text-emerald-400' },
    { key: 'dinner', title: '晚餐', Icon: Moon, color: 'text-indigo-400' },
  ];

  const filteredFoods = foodList.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['全部', '主食', '肉蛋鱼', '油脂', '蔬菜/水果', '坚果/种子'];

  const handleAddFoodToMeal = (food: FoodItem, mealKey: keyof MealPlannerProps['meals']) => {
    const currentItems = meals[mealKey];
    const existingIndex = currentItems.findIndex((item) => item.foodId === food.id);
    let updated: SelectedMealItem[];
    if (existingIndex >= 0) {
      updated = currentItems.map((item, idx) =>
        idx === existingIndex ? { ...item, amount: item.amount + (food.unit === '个' ? 1 : 50) } : item
      );
    } else {
      updated = [
        ...currentItems,
        {
          id: `${food.id}-${Date.now()}`,
          foodId: food.id,
          amount: food.unit === '个' ? 1 : food.baseAmount,
        },
      ];
    }
    onUpdateMeal(mealKey, updated);
  };

  const handleAmountChange = (
    mealKey: keyof MealPlannerProps['meals'],
    itemId: string,
    amount: number
  ) => {
    const updated = meals[mealKey].map((item) =>
      item.id === itemId ? { ...item, amount: Math.max(0, amount) } : item
    );
    onUpdateMeal(mealKey, updated);
  };

  const handleRemoveFood = (mealKey: keyof MealPlannerProps['meals'], itemId: string) => {
    const updated = meals[mealKey].filter((item) => item.id !== itemId);
    onUpdateMeal(mealKey, updated);
  };

  const calculateMealTotals = (items: SelectedMealItem[]) => {
    let carb = 0;
    let protein = 0;
    let fat = 0;

    items.forEach((item) => {
      const food = foodList.find((f) => f.id === item.foodId);
      if (food) {
        const factor = item.amount / food.baseAmount;
        carb += food.carbPerUnit * factor;
        protein += food.proteinPerUnit * factor;
        fat += food.fatPerUnit * factor;
      }
    });

    return {
      carb: Math.round(carb * 10) / 10,
      protein: Math.round(protein * 10) / 10,
      fat: Math.round(fat * 10) / 10,
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start mb-4">
      {/* 左侧：一日五餐规划 (紧凑平铺展现) */}
      <div ref={leftColRef} className="lg:col-span-7 flex flex-col">
        <div className="flex items-center justify-between h-6 mb-1.5 flex-shrink-0">
          <h2 className="text-xs sm:text-sm font-bold text-slate-100 flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-emerald-400" />
            一日五餐安排
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">点击餐卡选择/添加食材</span>
        </div>

        <div className="space-y-1.5 flex-1 flex flex-col justify-between">
          {mealConfigs.map((config) => {
            const items = meals[config.key];
            const totals = calculateMealTotals(items);
            const isActive = activeMealKey === config.key;
            const ConfigIcon = config.Icon;

            return (
              <div
                key={config.key}
                onClick={() => setActiveMealKey(config.key)}
                className={`glass-card rounded-xl p-2 sm:p-2.5 border transition-all cursor-pointer ${
                  isActive
                    ? 'border-emerald-500/80 shadow-md shadow-emerald-500/10 bg-slate-900/90'
                    : 'border-slate-800/80 hover:border-slate-700 bg-slate-900/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ConfigIcon className={`w-4 h-4 ${config.color}`} />
                    <h3 className="font-bold text-slate-100 text-xs sm:text-sm">{config.title}</h3>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-blue-400 font-bold">{totals.carb}g碳</span>
                    <span className="text-rose-400 font-bold">{totals.protein}g蛋</span>
                    <span className="text-amber-400 font-bold">{totals.fat}g脂</span>
                    <button
                      className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-slate-950 shadow-sm font-black'
                          : 'bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {isActive ? '添加中' : '+ 选食材'}
                    </button>
                  </div>
                </div>

                {items.length > 0 && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 space-y-1" onClick={(e) => e.stopPropagation()}>
                    {items.map((item) => {
                      const food = foodList.find((f) => f.id === item.foodId);
                      if (!food) return null;
                      const factor = item.amount / food.baseAmount;
                      const c = Math.round(food.carbPerUnit * factor * 10) / 10;
                      const p = Math.round(food.proteinPerUnit * factor * 10) / 10;
                      const f = Math.round(food.fatPerUnit * factor * 10) / 10;

                      return (
                        <div
                          key={item.id}
                          className="h-8 flex items-center justify-between bg-slate-950/80 px-2.5 rounded-lg border border-slate-800/80 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <span className="font-bold text-slate-100 truncate text-xs">{food.name}</span>
                            <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-800/60 font-mono text-[10px] flex-shrink-0">
                              <span className="text-sky-400 font-medium">{c}g碳</span>
                              <span className="text-rose-400 font-medium">{p}g蛋</span>
                              <span className="text-amber-400 font-medium">{f}g脂</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <input
                              type="number"
                              min="0"
                              step={food.unit === '个' ? 1 : 5}
                              value={item.amount}
                              onChange={(e) => handleAmountChange(config.key, item.id, parseFloat(e.target.value) || 0)}
                              className="w-14 bg-slate-900 border border-slate-700 px-1 py-0.5 rounded text-center text-xs font-mono font-extrabold text-emerald-400 focus:outline-none focus:border-emerald-500"
                            />
                            <span className="text-[11px] text-slate-400 font-medium">{food.unit === '个' ? '个' : 'g'}</span>
                            <button
                              onClick={() => handleRemoveFood(config.key, item.id)}
                              className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 右侧：智能配餐 + 食材选择库 */}
      <div
        className="lg:col-span-5 flex flex-col min-h-0"
        style={{ height: leftHeight ? `${leftHeight}px` : undefined }}
      >
        {/* 1. 智能配餐切换栏 */}
        <div className="mb-2.5 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-2 flex-shrink-0">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
            <span className="flex items-center gap-1 text-slate-200">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              一键智能配餐
            </span>
            <button
              onClick={onShuffleVariant}
              className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 px-3 py-1 rounded-lg border border-indigo-500/30 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" /> 随机换一套 (无限次)
            </button>
          </div>
        </div>

        {/* 2. 主卡片容器：智能配餐模式选择按钮 + 食材选择库 */}
        <div className="glass-card rounded-xl p-2.5 sm:p-3 border border-slate-800/80 flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* 模式选择按钮组 */}
          <div className="grid grid-cols-3 gap-1.5 mb-2 pb-2 border-b border-slate-800/80 flex-shrink-0">
            <button
              onClick={() => onAutoPlan('simple')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                activeMode === 'simple'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              简单模式
            </button>

            <button
              onClick={() => onAutoPlan('balanced')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                activeMode === 'balanced'
                  ? 'bg-teal-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              均衡模式
            </button>

            <button
              onClick={() => onAutoPlan('budget')}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                activeMode === 'budget'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              经济模式
            </button>
          </div>

          {/* 选食材标题与搜索框 */}
          <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
            <h3 className="font-bold text-slate-100 text-xs sm:text-sm flex items-center gap-1">
              <Plus className="w-4 h-4 text-emerald-400" />
              为【{mealConfigs.find((m) => m.key === activeMealKey)?.title}】选食材
            </h3>
          </div>

          <div className="relative mb-2 flex-shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="搜索食材 (如 米饭/燕麦/牛肉)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 pl-8 pr-2 py-1 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* 食材分类标签 */}
          <div className="flex flex-wrap gap-1 mb-2 flex-shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-md text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-extrabold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 食材列表 flex-1 min-h-0 overflow-y-auto 自适应撑满主卡片内部高度 */}
          <div className="space-y-1 flex-1 min-h-0 overflow-y-auto pr-1">
            {filteredFoods.map((food) => (
              <div
                key={food.id}
                onClick={() => handleAddFoodToMeal(food, activeMealKey)}
                className="flex items-center justify-between p-1.5 sm:p-2 bg-slate-950/60 hover:bg-slate-800/90 rounded-lg border border-slate-800/80 cursor-pointer text-xs transition-all group"
              >
                <div>
                  <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                    {food.name}
                    {food.isTanOriginal && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        谭
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-1">
                    <span>每{food.unit === '个' ? '1个' : '100g'}:</span>
                    <span className="text-blue-400 font-bold">{food.carbPerUnit}g碳</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-rose-400 font-bold">{food.proteinPerUnit}g蛋</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-amber-400 font-bold">{food.fatPerUnit}g脂</span>
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-900 group-hover:bg-emerald-500 group-hover:text-slate-950 text-slate-300 rounded-md border border-slate-800 transition-all flex-shrink-0">
                  + 加入
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

