import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { UserStatsForm } from './components/UserStatsForm';
import { Dashboard } from './components/Dashboard';
import { MealPlanner } from './components/MealPlanner';
import { FoodLibraryModal } from './components/FoodLibraryModal';
import { TipsCard } from './components/TipsCard';
import { ExportPosterView } from './components/ExportPosterView';
import { INITIAL_FOOD_DATABASE, FoodItem } from './data/foodDatabase';
import {
  Gender,
  CalculateParams,
  calculateNutritionTargets,
  DayLog,
  SelectedMealItem,
  WORKOUT_PRESETS,
} from './utils/calculator';
import { generateAutoMealPlan, AutoPlanMode } from './utils/autoPlanner';
import { exportPosterImage } from './utils/exportPoster';
import { Camera } from 'lucide-react';

const LOCAL_STORAGE_LOGS_KEY = 'tan_fat_loss_logs_v2';
const LOCAL_STORAGE_FOODS_KEY = 'tan_fat_loss_custom_foods_v2';

export function App() {
  const getTodayString = () => new Date().toISOString().split('T')[0];
  const [currentDate, setCurrentDate] = useState<string>(getTodayString());

  const [activeMode, setActiveMode] = useState<AutoPlanMode>('balanced');
  const [variantSeed, setVariantSeed] = useState<number>(0);
  const [planName, setPlanName] = useState<string>('');

  const [foodList, setFoodList] = useState<FoodItem[]>(() => {
    try {
      const savedCustom = localStorage.getItem(LOCAL_STORAGE_FOODS_KEY);
      if (savedCustom) {
        const customFoods: FoodItem[] = JSON.parse(savedCustom);
        return [...INITIAL_FOOD_DATABASE, ...customFoods];
      }
    } catch (e) {
      console.error('Failed to load custom foods', e);
    }
    return INITIAL_FOOD_DATABASE;
  });

  const [dayLogs, setDayLogs] = useState<Record<string, DayLog>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load day logs', e);
    }
    return {};
  });

  const [isFoodLibraryOpen, setIsFoodLibraryOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(dayLogs));
    } catch (e) {
      console.error('Failed to save logs', e);
    }
  }, [dayLogs]);

  const currentDayLog: DayLog = useMemo(() => {
    if (dayLogs[currentDate]) {
      return dayLogs[currentDate];
    }
    const previousDates = Object.keys(dayLogs).sort();
    const lastLog = previousDates.length > 0 ? dayLogs[previousDates[previousDates.length - 1]] : null;

    return {
      date: currentDate,
      gender: lastLog ? lastLog.gender : '男',
      weightKg: lastLog ? lastLog.weightKg : 65,
      workoutPresetId: lastLog ? lastLog.workoutPresetId : 'medium',
      carbAdj: 0,
      proteinAdj: 0,
      fatAdj: 0,
      meals: {
        breakfast: [],
        snack1: [],
        lunch: [],
        snack2: [],
        dinner: [],
      },
    };
  }, [currentDate, dayLogs]);

  const updateCurrentDayLog = (updater: (prev: DayLog) => DayLog) => {
    setDayLogs((prev) => {
      const updated = updater(currentDayLog);
      return {
        ...prev,
        [currentDate]: updated,
      };
    });
  };

  const calcParams: CalculateParams = {
    gender: currentDayLog.gender,
    weightKg: currentDayLog.weightKg,
    workoutPresetId: currentDayLog.workoutPresetId,
    carbAdj: currentDayLog.carbAdj,
    proteinAdj: currentDayLog.proteinAdj,
    fatAdj: currentDayLog.fatAdj,
  };

  const nutritionTarget = useMemo(() => calculateNutritionTargets(calcParams), [calcParams]);

  const actualTotals = useMemo(() => {
    let carb = 0;
    let protein = 0;
    let fat = 0;

    const allMealItems: SelectedMealItem[] = [
      ...currentDayLog.meals.breakfast,
      ...currentDayLog.meals.snack1,
      ...currentDayLog.meals.lunch,
      ...currentDayLog.meals.snack2,
      ...currentDayLog.meals.dinner,
    ];

    allMealItems.forEach((item) => {
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
  }, [currentDayLog.meals, foodList]);

  const handleAutoPlan = (mode: AutoPlanMode = 'balanced', seed: number = variantSeed) => {
    setActiveMode(mode);
    const result = generateAutoMealPlan(nutritionTarget, foodList, mode, seed);
    setPlanName(result.planName);
    updateCurrentDayLog((log) => ({
      ...log,
      meals: {
        breakfast: result.breakfast,
        snack1: result.snack1,
        lunch: result.lunch,
        snack2: result.snack2,
        dinner: result.dinner,
      },
    }));
  };

  const handleShuffleVariant = () => {
    const nextSeed = variantSeed + 1;
    setVariantSeed(nextSeed);
    handleAutoPlan(activeMode, nextSeed);
  };

  const handleAddCustomFood = (newFood: FoodItem) => {
    setFoodList((prev) => {
      const updated = [...prev, newFood];
      const customOnly = updated.filter((f) => !f.isTanOriginal && f.id.startsWith('custom-'));
      localStorage.setItem(LOCAL_STORAGE_FOODS_KEY, JSON.stringify(customOnly));
      return updated;
    });
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dayLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `减脂打卡数据备份_${currentDate}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedLogs = JSON.parse(event.target?.result as string);
            setDayLogs(importedLogs);
            alert('数据导入成功！');
          } catch (err) {
            alert('无效的 JSON 数据文件格式');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetDay = () => {
    if (confirm(`确定要重置 ${currentDate} 的食谱和数据吗？`)) {
      setDayLogs((prev) => {
        const copy = { ...prev };
        delete copy[currentDate];
        return copy;
      });
      setPlanName('');
    }
  };

  const currentPreset =
    WORKOUT_PRESETS.find((p) => p.id === currentDayLog.workoutPresetId) || WORKOUT_PRESETS[1];

  const handleExportPoster = () => {
    exportPosterImage('clean-poster-export-area', `减脂打卡计划_${currentDate}.png`);
  };

  return (
    <div className="min-h-screen pb-16">
      <Header
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        onOpenFoodLibrary={() => setIsFoodLibraryOpen(true)}
        onExportData={handleExportData}
        onImportData={handleImportData}
        onResetDay={handleResetDay}
      />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-1">
        <TipsCard />

        <UserStatsForm
          gender={currentDayLog.gender}
          weightKg={currentDayLog.weightKg}
          workoutPresetId={currentDayLog.workoutPresetId}
          carbAdj={currentDayLog.carbAdj}
          proteinAdj={currentDayLog.proteinAdj}
          fatAdj={currentDayLog.fatAdj}
          onGenderChange={(g: Gender) => updateCurrentDayLog((log) => ({ ...log, gender: g }))}
          onWeightChange={(w: number) => updateCurrentDayLog((log) => ({ ...log, weightKg: w }))}
          onWorkoutChange={(presetId: string) => updateCurrentDayLog((log) => ({ ...log, workoutPresetId: presetId }))}
          onCarbAdjChange={(adj: number) => updateCurrentDayLog((log) => ({ ...log, carbAdj: adj }))}
          onProteinAdjChange={(adj: number) => updateCurrentDayLog((log) => ({ ...log, proteinAdj: adj }))}
          onFatAdjChange={(adj: number) => updateCurrentDayLog((log) => ({ ...log, fatAdj: adj }))}
        />

        <Dashboard
          target={nutritionTarget}
          actualCarb={actualTotals.carb}
          actualProtein={actualTotals.protein}
          actualFat={actualTotals.fat}
        />

        {/* 智能配餐与五餐列表精准平齐 */}
        <MealPlanner
          foodList={foodList}
          meals={currentDayLog.meals}
          activeMode={activeMode}
          onUpdateMeal={(mealKey, items) =>
            updateCurrentDayLog((log) => ({
              ...log,
              meals: {
                ...log.meals,
                [mealKey]: items,
              },
            }))
          }
          onAutoPlan={(m) => handleAutoPlan(m, 0)}
          onShuffleVariant={handleShuffleVariant}
        />
      </main>

      {/* 底部 Footer 核心导出海报图片主按键区域 */}
      <footer className="max-w-[1440px] mx-auto px-4 sm:px-6 mt-3">
        <button
          onClick={handleExportPoster}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.005] active:scale-[0.995] cursor-pointer"
        >
          <Camera className="w-4 h-4 fill-current" />
          <span>导出今日减脂饮食计划海报 PNG 图片</span>
        </button>
      </footer>

      <FoodLibraryModal
        isOpen={isFoodLibraryOpen}
        onClose={() => setIsFoodLibraryOpen(false)}
        foodList={foodList}
        onAddCustomFood={handleAddCustomFood}
      />

      {/* 离屏纯净专属海报导出区域 (无任何操作按钮/选食材库，专为高清截图打造) */}
      <div
        className="pointer-events-none fixed opacity-0 overflow-hidden"
        style={{ top: '-9999px', left: '-9999px', width: '720px', zIndex: -9999 }}
        aria-hidden="true"
      >
        <ExportPosterView
          id="clean-poster-export-area"
          date={currentDate}
          gender={currentDayLog.gender}
          weightKg={currentDayLog.weightKg}
          workoutLabel={currentPreset.label}
          target={nutritionTarget}
          actualTotals={actualTotals}
          meals={currentDayLog.meals}
          foodList={foodList}
          planName={planName}
        />
      </div>
    </div>
  );
}
