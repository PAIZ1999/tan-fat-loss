import { FoodItem } from '../data/foodDatabase';
import { NutritionTarget, SelectedMealItem } from './calculator';

export type AutoPlanMode = 'simple' | 'balanced' | 'budget';

export interface AutoMealPlanResult {
  breakfast: SelectedMealItem[];
  snack1: SelectedMealItem[];
  lunch: SelectedMealItem[];
  snack2: SelectedMealItem[];
  dinner: SelectedMealItem[];
  planName: string;
}

/**
 * 数组随机抽样辅助函数
 */
function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 计算单个食材在指定摄入量下的碳水、蛋白质、脂肪含量
 */
function getNutrients(food: FoodItem | undefined, amount: number) {
  if (!food) return { carb: 0, protein: 0, fat: 0 };
  const factor = amount / (food.baseAmount || 100);
  return {
    carb: (food.carbPerUnit || 0) * factor,
    protein: (food.proteinPerUnit || 0) * factor,
    fat: (food.fatPerUnit || 0) * factor,
  };
}

/**
 * 根据目标营养素克数反算食材推荐摄入量 (g 或 个)
 */
function calcFoodAmount(
  food: FoodItem | undefined,
  targetNutrientGrams: number,
  nutrientKey: 'carbPerUnit' | 'proteinPerUnit' | 'fatPerUnit',
  minAmount: number = 0
): number {
  if (!food) return minAmount;
  const nutrientPerBase = food[nutrientKey] || 0;
  if (nutrientPerBase <= 0) return minAmount;

  if (food.unit === '个') {
    const rawCount = targetNutrientGrams / nutrientPerBase;
    return Math.max(minAmount, Math.round(rawCount));
  } else {
    // baseAmount 通常为 100g
    const base = food.baseAmount || 100;
    const rawGrams = (targetNutrientGrams / nutrientPerBase) * base;
    return Math.max(minAmount, Math.round(rawGrams));
  }
}

/**
 * 真正无限动态随机智能配餐算法
 * 每次触发均从食材库中随机抽样组合，并精确反算三大营养素分配克数
 */
export function generateAutoMealPlan(
  target: NutritionTarget,
  foodList: FoodItem[],
  mode: AutoPlanMode = 'balanced',
  _seed: number = 0
): AutoMealPlanResult {
  const { carbGrams, proteinGrams, fatGrams } = target;
  const findFood = (id: string) => foodList.find((f) => f.id === id);

  // 基础食物安全获取
  const oat = findFood('tan-oatmeal') || foodList[0];
  const egg = findFood('tan-whole-egg') || foodList[0];
  const eggWhite = findFood('custom-egg-white') || egg;
  const rice = findFood('custom-cooked-rice') || foodList[0];
  const rawRice = findFood('tan-rice-raw') || rice;
  const mantou = findFood('custom-steamed-bun') || rice;
  const brownRice = findFood('custom-brown-rice') || rice;
  const sweetPotato = findFood('tan-sweet-potato') || foodList[0];
  const purplePotato = findFood('tan-purple-potato') || sweetPotato;
  const potato = findFood('tan-potato') || foodList[0];
  const pumpkin = findFood('tan-pumpkin') || sweetPotato;

  const beef = findFood('tan-beef-raw') || foodList[0];
  const chicken = findFood('tan-chicken-breast') || foodList[0];
  const chickenThigh = findFood('tan-chicken-thigh') || chicken;
  const porkLoin = findFood('custom-pork-tenderloin') || chicken;
  const shrimp = findFood('tan-shrimp') || foodList[0];
  const basaFish = findFood('tan-basa-fish') || foodList[0];
  const basaBasa = findFood('custom-basa-fish-fillet') || basaFish;
  const tofu = findFood('custom-tofu') || foodList[0];

  const milk = findFood('custom-milk') || foodList[0];
  const oil = findFood('tan-olive-oil') || foodList[0];
  const veg = findFood('tan-veg') || foodList[0];
  const banana = findFood('custom-banana') || foodList[0];
  const blueberry = findFood('tan-blueberry') || banana;
  const avocado = findFood('tan-avocado') || oil;
  const nuts = findFood('tan-nuts') || oil;

  const planIdNumber = Math.floor(Math.random() * 9000 + 1000);

  if (mode === 'budget') {
    // =========================================================================
    // 💰 【穷鬼平价模式】：从极低成本食材池中无限随机抽选
    // =========================================================================
    const budgetStaples = [rice, potato, sweetPotato, purplePotato, mantou, brownRice, rawRice].filter(Boolean);
    const budgetProteins = [chicken, tofu, porkLoin, chickenThigh].filter(Boolean);

    const chosenStaple1 = getRandomItem(budgetStaples) || rice;
    const chosenStaple2 = getRandomItem(budgetStaples) || rice;
    const chosenProtein1 = getRandomItem(budgetProteins) || chicken;
    const chosenProtein2 = getRandomItem(budgetProteins) || chicken;

    const planName = `穷鬼平价随机方案 #${planIdNumber} (${chosenProtein1.name} + ${chosenProtein2.name} + ${chosenStaple1.name})`;

    // 早餐：燕麦（提供约 25%~30% 碳水） + 2~3 个鸡蛋
    const eggCount = Math.min(3, Math.max(2, Math.round((proteinGrams * 0.18) / 7)));
    const targetBfCarb = carbGrams * 0.28;
    const oatGrams = calcFoodAmount(oat, targetBfCarb, 'carbPerUnit', 30);

    const bfOatNutrients = getNutrients(oat, oatGrams);
    const bfEggNutrients = getNutrients(egg, eggCount);

    const usedCarb = bfOatNutrients.carb + bfEggNutrients.carb;
    const usedProtein = bfOatNutrients.protein + bfEggNutrients.protein;
    const usedFat = bfOatNutrients.fat + bfEggNutrients.fat;

    const remCarb = Math.max(10, carbGrams - usedCarb);
    const remProtein = Math.max(10, proteinGrams - usedProtein);
    const remFat = Math.max(6, fatGrams - usedFat);

    const halfCarb = remCarb / 2;
    const halfProtein = remProtein / 2;
    const halfFat = remFat / 2;

    const lStapleGrams = calcFoodAmount(chosenStaple1, halfCarb, 'carbPerUnit', 50);
    const lProtGrams = calcFoodAmount(chosenProtein1, halfProtein, 'proteinPerUnit', 50);

    const dStapleGrams = calcFoodAmount(chosenStaple2, halfCarb, 'carbPerUnit', 50);
    const dProtGrams = calcFoodAmount(chosenProtein2, halfProtein, 'proteinPerUnit', 50);

    // 动态扣除各餐主食与蛋白质源自带的脂肪
    const currentFat =
      bfOatNutrients.fat +
      bfEggNutrients.fat +
      getNutrients(chosenStaple1, lStapleGrams).fat +
      getNutrients(chosenProtein1, lProtGrams).fat +
      getNutrients(chosenStaple2, dStapleGrams).fat +
      getNutrients(chosenProtein2, dProtGrams).fat;

    const remOilFat = Math.max(6, fatGrams - currentFat);
    const halfOil = Math.max(3, Math.round(remOilFat / 2));
    const lOilGrams = calcFoodAmount(oil, halfOil, 'fatPerUnit', 3);
    const dOilGrams = calcFoodAmount(oil, halfOil, 'fatPerUnit', 3);

    return {
      planName,
      breakfast: [
        { id: `bg-b1-${Date.now()}-${Math.random()}`, foodId: oat.id, amount: oatGrams },
        { id: `bg-b2-${Date.now()}-${Math.random()}`, foodId: egg.id, amount: eggCount },
      ],
      snack1: [],
      lunch: [
        { id: `bg-l1-${Date.now()}-${Math.random()}`, foodId: chosenStaple1.id, amount: lStapleGrams },
        { id: `bg-l2-${Date.now()}-${Math.random()}`, foodId: chosenProtein1.id, amount: lProtGrams },
        { id: `bg-l3-${Date.now()}-${Math.random()}`, foodId: oil.id, amount: lOilGrams },
        { id: `bg-l4-${Date.now()}-${Math.random()}`, foodId: veg.id, amount: 300 },
      ],
      snack2: [],
      dinner: [
        { id: `bg-d1-${Date.now()}-${Math.random()}`, foodId: chosenStaple2.id, amount: dStapleGrams },
        { id: `bg-d2-${Date.now()}-${Math.random()}`, foodId: chosenProtein2.id, amount: dProtGrams },
        { id: `bg-d3-${Date.now()}-${Math.random()}`, foodId: oil.id, amount: dOilGrams },
        { id: `bg-d4-${Date.now()}-${Math.random()}`, foodId: veg.id, amount: 300 },
      ],
    };
  } else if (mode === 'balanced') {
    // =========================================================================
    // 🥗 【营养均衡模式】：丰富高品质食材池中无限随机抽选 + 水果/健康脂加餐
    // =========================================================================
    const balancedStaples = [sweetPotato, purplePotato, rice, brownRice, potato, pumpkin, rawRice].filter(Boolean);
    const balancedProteins = [shrimp, basaFish, basaBasa, beef, chickenThigh, chicken, porkLoin, tofu].filter(Boolean);
    const balancedSnacks = [banana, blueberry, avocado, nuts, milk].filter(Boolean);

    const chosenStaple1 = getRandomItem(balancedStaples) || sweetPotato;
    const chosenStaple2 = getRandomItem(balancedStaples) || rice;
    const chosenProtein1 = getRandomItem(balancedProteins) || beef;
    const chosenProtein2 = getRandomItem(balancedProteins) || chicken;
    const chosenSnack = getRandomItem(balancedSnacks) || banana;

    const planName = `均衡多元随机方案 #${planIdNumber} (${chosenProtein1.name} + ${chosenProtein2.name} + ${chosenSnack.name})`;

    // 早餐: 牛奶 200g + 鸡蛋 2个 + 燕麦
    const milkAmount = 200;
    const eggCount = 2;
    const milkNutrients = getNutrients(milk, milkAmount);
    const eggNutrients = getNutrients(egg, eggCount);

    // 早餐目标碳水 25%~30%，减去牛奶已含有的碳水 (约10g)
    const targetBfCarb = Math.max(15, carbGrams * 0.25 - milkNutrients.carb);
    const oatGrams = calcFoodAmount(oat, targetBfCarb, 'carbPerUnit', 30);
    const oatNutrients = getNutrients(oat, oatGrams);

    // 下午加餐
    let snackAmount = 100;
    if (nuts && chosenSnack.id === nuts.id) snackAmount = 15;
    else if (milk && chosenSnack.id === milk.id) snackAmount = 200;
    else if (avocado && chosenSnack.id === avocado.id) snackAmount = 50;
    else if (banana && chosenSnack.id === banana.id) snackAmount = 100;
    else if (blueberry && chosenSnack.id === blueberry.id) snackAmount = 100;

    const snackNutrients = getNutrients(chosenSnack, snackAmount);

    // 统计已占用的宏量营养素
    const usedCarb = milkNutrients.carb + eggNutrients.carb + oatNutrients.carb + snackNutrients.carb;
    const usedProtein = milkNutrients.protein + eggNutrients.protein + oatNutrients.protein + snackNutrients.protein;

    const remCarb = Math.max(10, carbGrams - usedCarb);
    const remProtein = Math.max(10, proteinGrams - usedProtein);

    const halfCarb = remCarb / 2;
    const halfProtein = remProtein / 2;

    const lStapleGrams = calcFoodAmount(chosenStaple1, halfCarb, 'carbPerUnit', 50);
    const lProtGrams = calcFoodAmount(chosenProtein1, halfProtein, 'proteinPerUnit', 50);

    const dStapleGrams = calcFoodAmount(chosenStaple2, halfCarb, 'carbPerUnit', 50);
    const dProtGrams = calcFoodAmount(chosenProtein2, halfProtein, 'proteinPerUnit', 50);

    // 统计目前已有的脂肪含量
    const currentFat =
      milkNutrients.fat +
      eggNutrients.fat +
      oatNutrients.fat +
      snackNutrients.fat +
      getNutrients(chosenStaple1, lStapleGrams).fat +
      getNutrients(chosenProtein1, lProtGrams).fat +
      getNutrients(chosenStaple2, dStapleGrams).fat +
      getNutrients(chosenProtein2, dProtGrams).fat;

    const remOilFat = Math.max(6, fatGrams - currentFat);
    const halfOil = Math.max(3, Math.round(remOilFat / 2));
    const lOilGrams = calcFoodAmount(oil, halfOil, 'fatPerUnit', 3);
    const dOilGrams = calcFoodAmount(oil, halfOil, 'fatPerUnit', 3);

    return {
      planName,
      breakfast: [
        { id: `bl-b1-${Date.now()}-${Math.random()}`, foodId: milk.id, amount: milkAmount },
        { id: `bl-b2-${Date.now()}-${Math.random()}`, foodId: egg.id, amount: eggCount },
        { id: `bl-b3-${Date.now()}-${Math.random()}`, foodId: oat.id, amount: oatGrams },
      ],
      snack1: [],
      lunch: [
        { id: `bl-l1-${Date.now()}-${Math.random()}`, foodId: chosenStaple1.id, amount: lStapleGrams },
        { id: `bl-l2-${Date.now()}-${Math.random()}`, foodId: chosenProtein1.id, amount: lProtGrams },
        { id: `bl-l3-${Date.now()}-${Math.random()}`, foodId: oil.id, amount: lOilGrams },
        { id: `bl-l4-${Date.now()}-${Math.random()}`, foodId: veg.id, amount: 300 },
      ],
      snack2: [{ id: `bl-s2-${Date.now()}-${Math.random()}`, foodId: chosenSnack.id, amount: snackAmount }],
      dinner: [
        { id: `bl-d1-${Date.now()}-${Math.random()}`, foodId: chosenStaple2.id, amount: dStapleGrams },
        { id: `bl-d2-${Date.now()}-${Math.random()}`, foodId: chosenProtein2.id, amount: dProtGrams },
        { id: `bl-d3-${Date.now()}-${Math.random()}`, foodId: oil.id, amount: dOilGrams },
        { id: `bl-d4-${Date.now()}-${Math.random()}`, foodId: veg.id, amount: 300 },
      ],
    };
  } else {
    // =========================================================================
    // ⚡ 【简单极速模式】：快捷主食 + 快捷蛋白质源无限随机
    // =========================================================================
    const simpleStaples = [rice, sweetPotato, potato, purplePotato, brownRice, rawRice].filter(Boolean);
    const simpleProteins = [beef, chicken, porkLoin, chickenThigh, shrimp].filter(Boolean);

    const chosenStaple = getRandomItem(simpleStaples) || rice;
    const chosenProtein = getRandomItem(simpleProteins) || chicken;

    const planName = `简单极速随机方案 #${planIdNumber} (${chosenProtein.name} + ${chosenStaple.name})`;

    // 早餐：燕麦（约 30% 碳水） + 2~3 个鸡蛋
    const eggCount = Math.min(3, Math.max(2, Math.round((proteinGrams * 0.18) / 7)));
    const targetBfCarb = carbGrams * 0.32;
    const oatGrams = calcFoodAmount(oat, targetBfCarb, 'carbPerUnit', 30);

    const bfOatNutrients = getNutrients(oat, oatGrams);
    const bfEggNutrients = getNutrients(egg, eggCount);

    const usedCarb = bfOatNutrients.carb + bfEggNutrients.carb;
    const usedProtein = bfOatNutrients.protein + bfEggNutrients.protein;

    const remCarb = Math.max(10, carbGrams - usedCarb);
    const remProtein = Math.max(10, proteinGrams - usedProtein);

    const halfCarb = remCarb / 2;
    const halfProtein = remProtein / 2;

    const lStapleGrams = calcFoodAmount(chosenStaple, halfCarb, 'carbPerUnit', 50);
    const lProtGrams = calcFoodAmount(chosenProtein, halfProtein, 'proteinPerUnit', 50);

    const dStapleGrams = calcFoodAmount(chosenStaple, halfCarb, 'carbPerUnit', 50);
    const dProtGrams = calcFoodAmount(chosenProtein, halfProtein, 'proteinPerUnit', 50);

    const currentFat =
      bfOatNutrients.fat +
      bfEggNutrients.fat +
      getNutrients(chosenStaple, lStapleGrams).fat +
      getNutrients(chosenProtein, lProtGrams).fat +
      getNutrients(chosenStaple, dStapleGrams).fat +
      getNutrients(chosenProtein, dProtGrams).fat;

    const remOilFat = Math.max(6, fatGrams - currentFat);
    const halfOil = Math.max(3, Math.round(remOilFat / 2));
    const lOilGrams = calcFoodAmount(oil, halfOil, 'fatPerUnit', 3);
    const dOilGrams = calcFoodAmount(oil, halfOil, 'fatPerUnit', 3);

    return {
      planName,
      breakfast: [
        { id: `sp-b1-${Date.now()}-${Math.random()}`, foodId: oat.id, amount: oatGrams },
        { id: `sp-b2-${Date.now()}-${Math.random()}`, foodId: egg.id, amount: eggCount },
      ],
      snack1: [],
      lunch: [
        { id: `sp-l1-${Date.now()}-${Math.random()}`, foodId: chosenStaple.id, amount: lStapleGrams },
        { id: `sp-l2-${Date.now()}-${Math.random()}`, foodId: chosenProtein.id, amount: lProtGrams },
        { id: `sp-l3-${Date.now()}-${Math.random()}`, foodId: oil.id, amount: lOilGrams },
        { id: `sp-l4-${Date.now()}-${Math.random()}`, foodId: veg.id, amount: 300 },
      ],
      snack2: [],
      dinner: [
        { id: `sp-d1-${Date.now()}-${Math.random()}`, foodId: chosenStaple.id, amount: dStapleGrams },
        { id: `sp-d2-${Date.now()}-${Math.random()}`, foodId: chosenProtein.id, amount: dProtGrams },
        { id: `sp-d3-${Date.now()}-${Math.random()}`, foodId: oil.id, amount: dOilGrams },
        { id: `sp-d4-${Date.now()}-${Math.random()}`, foodId: veg.id, amount: 300 },
      ],
    };
  }
}

