export type Gender = '男' | '女';

export interface WorkoutPreset {
  id: string;
  label: string;
  desc: string;
  maleCarbRatio: number;
  maleProteinRatio: number;
  maleFatRatio: number;
  femaleCarbRatio: number;
  femaleProteinRatio: number;
  femaleFatRatio: number;
}

export const WORKOUT_PRESETS: WorkoutPreset[] = [
  {
    id: 'rest',
    label: '休息日 / 无运动',
    desc: '恢复调整期，控制碳水输入',
    maleCarbRatio: 2.2,
    maleProteinRatio: 1.4,
    maleFatRatio: 0.8,
    femaleCarbRatio: 2.0,
    femaleProteinRatio: 1.3,
    femaleFatRatio: 0.8,
  },
  {
    id: 'light',
    label: '2-3小时 / 2次（轻度）',
    desc: '适合刚跟练或恢复训练阶段',
    maleCarbRatio: 2.2,
    maleProteinRatio: 1.4,
    maleFatRatio: 0.8,
    femaleCarbRatio: 2.2,
    femaleProteinRatio: 1.4,
    femaleFatRatio: 0.8,
  },
  {
    id: 'medium',
    label: '4-5小时 / 3次（标准）',
    desc: '经典减脂拉锯战推荐训练频次',
    maleCarbRatio: 2.5,
    maleProteinRatio: 1.6,
    maleFatRatio: 0.9,
    femaleCarbRatio: 2.4,
    femaleProteinRatio: 1.5,
    femaleFatRatio: 0.85,
  },
  {
    id: 'high',
    label: '6-8小时 / 4-5次（高强度）',
    desc: '老手或大强度进阶期',
    maleCarbRatio: 3.0,
    maleProteinRatio: 1.8,
    maleFatRatio: 1.0,
    femaleCarbRatio: 2.7,
    femaleProteinRatio: 1.6,
    femaleFatRatio: 0.9,
  }
];

export interface NutritionTarget {
  carbGrams: number;
  proteinGrams: number;
  fatGrams: number;
  totalCalories: number;
  carbRatioUsed: number;
  proteinRatioUsed: number;
  fatRatioUsed: number;
}

export interface CalculateParams {
  gender: Gender;
  weightKg: number;
  workoutPresetId: string;
  carbAdj?: number; // 碳水调节系数 (+/-)
  proteinAdj?: number;
  fatAdj?: number;
}

export function calculateNutritionTargets(params: CalculateParams): NutritionTarget {
  const { gender, weightKg, workoutPresetId, carbAdj = 0, proteinAdj = 0, fatAdj = 0 } = params;

  const preset = WORKOUT_PRESETS.find(p => p.id === workoutPresetId) || WORKOUT_PRESETS[1];

  let baseCarb = gender === '男' ? preset.maleCarbRatio : preset.femaleCarbRatio;
  let baseProtein = gender === '男' ? preset.maleProteinRatio : preset.femaleProteinRatio;
  let baseFat = gender === '男' ? preset.maleFatRatio : preset.femaleFatRatio;

  const finalCarbRatio = Math.max(0.5, baseCarb + carbAdj);
  const finalProteinRatio = Math.max(0.5, baseProtein + proteinAdj);
  const finalFatRatio = Math.max(0.2, baseFat + fatAdj);

  const carbGrams = Math.round(weightKg * finalCarbRatio * 10) / 10;
  const proteinGrams = Math.round(weightKg * finalProteinRatio * 10) / 10;
  const fatGrams = Math.round(weightKg * finalFatRatio * 10) / 10;

  // 热量估算: 1g碳水=4kcal, 1g蛋白质=4kcal, 1g脂肪=9kcal
  const totalCalories = Math.round(carbGrams * 4 + proteinGrams * 4 + fatGrams * 9);

  return {
    carbGrams,
    proteinGrams,
    fatGrams,
    totalCalories,
    carbRatioUsed: finalCarbRatio,
    proteinRatioUsed: finalProteinRatio,
    fatRatioUsed: finalFatRatio
  };
}

export interface SelectedMealItem {
  id: string;
  foodId: string;
  amount: number; // 摄入量（g 或 个）
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  gender: Gender;
  weightKg: number;
  workoutPresetId: string;
  carbAdj: number;
  proteinAdj: number;
  fatAdj: number;
  meals: {
    breakfast: SelectedMealItem[];
    snack1: SelectedMealItem[];
    lunch: SelectedMealItem[];
    snack2: SelectedMealItem[];
    dinner: SelectedMealItem[];
  };
}
