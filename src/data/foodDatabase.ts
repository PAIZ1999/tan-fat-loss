export interface FoodItem {
  id: string;
  name: string;
  category: '主食' | '肉蛋鱼' | '油脂' | '蔬菜/水果' | '坚果/种子' | '其他';
  unit: string; // '100g' 或 '个'
  baseAmount: number; // 通常是 100g 或 1个
  carbPerUnit: number; // 碳水化合物(g)
  proteinPerUnit: number; // 蛋白质(g)
  fatPerUnit: number; // 脂肪(g)
  isTanOriginal: boolean; // 是否是谭师原版规范
  note?: string;
}

export const INITIAL_FOOD_DATABASE: FoodItem[] = [
  // 谭师原版主食
  {
    id: 'tan-oatmeal',
    name: '谭-燕麦（干）',
    category: '主食',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 60,
    proteinPerUnit: 13,
    fatPerUnit: 7,
    isTanOriginal: true,
    note: '燕麦植物蛋白与全蛋同食可充分吸收利用补足赖氨酸短板'
  },
  {
    id: 'tan-rice-raw',
    name: '谭-大米（生）',
    category: '主食',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 78.5,
    proteinPerUnit: 7.4,
    fatPerUnit: 0,
    isTanOriginal: true,
    note: '大米配合肉蛋鱼虾时植物蛋白可充分利用'
  },
  {
    id: 'tan-sweet-potato',
    name: '谭-红薯（生）',
    category: '主食',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 22,
    proteinPerUnit: 0,
    fatPerUnit: 0,
    isTanOriginal: true
  },
  {
    id: 'tan-purple-potato',
    name: '谭-紫薯（生）',
    category: '主食',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 22,
    proteinPerUnit: 0,
    fatPerUnit: 0,
    isTanOriginal: true
  },
  {
    id: 'tan-potato',
    name: '谭-土豆（生）',
    category: '主食',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 22,
    proteinPerUnit: 0,
    fatPerUnit: 0,
    isTanOriginal: true
  },
  {
    id: 'tan-pumpkin',
    name: '谭-贝贝南瓜（生）',
    category: '主食',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 22,
    proteinPerUnit: 0,
    fatPerUnit: 0,
    isTanOriginal: true,
    note: '贝贝南瓜口感像薯类，按薯类碳水折算'
  },

  // 谭师原版肉蛋鱼
  {
    id: 'tan-whole-egg',
    name: '谭-全蛋（个/44g）',
    category: '肉蛋鱼',
    unit: '个',
    baseAmount: 1,
    carbPerUnit: 0.4,
    proteinPerUnit: 7,
    fatPerUnit: 4,
    isTanOriginal: true,
    note: '单个鸡蛋蛋白质约7g，亮氨酸约0.65g'
  },
  {
    id: 'tan-beef-raw',
    name: '谭-牛肉（生）',
    category: '肉蛋鱼',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 24,
    fatPerUnit: 0,
    isTanOriginal: true
  },
  {
    id: 'tan-chicken-breast',
    name: '谭-鸡胸肉（生）',
    category: '肉蛋鱼',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 24,
    fatPerUnit: 0,
    isTanOriginal: true
  },
  {
    id: 'tan-chicken-thigh',
    name: '谭-去皮去骨鸡腿（生）',
    category: '肉蛋鱼',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 24,
    fatPerUnit: 0,
    isTanOriginal: true
  },
  {
    id: 'tan-shrimp',
    name: '谭-虾仁（生）',
    category: '肉蛋鱼',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 20,
    fatPerUnit: 0,
    isTanOriginal: true
  },
  {
    id: 'tan-basa-fish',
    name: '谭-巴沙鱼（生）',
    category: '肉蛋鱼',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 18,
    fatPerUnit: 0,
    isTanOriginal: true
  },
  {
    id: 'tan-sole-fish',
    name: '谭-龙利鱼（生）',
    category: '肉蛋鱼',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 18,
    fatPerUnit: 0,
    isTanOriginal: true
  },

  // 谭师原版油脂与补充
  {
    id: 'tan-olive-oil',
    name: '谭-橄榄油',
    category: '油脂',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 0,
    fatPerUnit: 100,
    isTanOriginal: true
  },
  {
    id: 'tan-avocado-oil',
    name: '谭-牛油果油',
    category: '油脂',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 0,
    fatPerUnit: 100,
    isTanOriginal: true
  },
  {
    id: 'tan-camellia-oil',
    name: '谭-山茶油',
    category: '油脂',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 0,
    fatPerUnit: 100,
    isTanOriginal: true
  },
  {
    id: 'tan-lard',
    name: '谭-猪油',
    category: '油脂',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 0,
    fatPerUnit: 100,
    isTanOriginal: true
  },

  // 谭师原版蔬菜坚果（新手暂不计算）
  {
    id: 'tan-nuts',
    name: '谭-坚果',
    category: '坚果/种子',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 0,
    fatPerUnit: 0,
    isTanOriginal: true,
    note: '新手阶段先忽略计算，养成习惯为主'
  },
  {
    id: 'tan-pumpkin-seeds',
    name: '谭-南瓜籽',
    category: '坚果/种子',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 0,
    fatPerUnit: 0,
    isTanOriginal: true,
    note: '新手阶段先忽略计算'
  },
  {
    id: 'tan-blueberry',
    name: '谭-蓝莓',
    category: '蔬菜/水果',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 0,
    fatPerUnit: 0,
    isTanOriginal: true,
    note: '新手阶段先忽略计算'
  },
  {
    id: 'tan-veg',
    name: '谭-蔬菜（通用）',
    category: '蔬菜/水果',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 0,
    fatPerUnit: 0,
    isTanOriginal: true,
    note: '谭师表示大部分常见绿叶蔬菜微量营养可先忽略'
  },

  // 自选经典食物库
  {
    id: 'custom-cooked-rice',
    name: '自选-熟米饭',
    category: '主食',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 25.9,
    proteinPerUnit: 2.6,
    fatPerUnit: 0.3,
    isTanOriginal: false,
    note: '熟米饭（含水率约65%）'
  },
  {
    id: 'custom-steamed-bun',
    name: '自选-蒸馒头（熟）',
    category: '主食',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 47,
    proteinPerUnit: 7,
    fatPerUnit: 1.1,
    isTanOriginal: false
  },
  {
    id: 'custom-brown-rice',
    name: '自选-糙米（生）',
    category: '主食',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 76,
    proteinPerUnit: 7.7,
    fatPerUnit: 2.7,
    isTanOriginal: false
  },
  {
    id: 'custom-quinoa',
    name: '自选-藜麦（生）',
    category: '主食',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 64.2,
    proteinPerUnit: 14.1,
    fatPerUnit: 6.1,
    isTanOriginal: false
  },
  {
    id: 'custom-pork-tenderloin',
    name: '自选-猪里脊（生）',
    category: '肉蛋鱼',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 20.2,
    fatPerUnit: 7.9,
    isTanOriginal: false
  },
  {
    id: 'custom-cod-fish',
    name: '自选-鳕鱼（生）',
    category: '肉蛋鱼',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 0,
    proteinPerUnit: 18,
    fatPerUnit: 0.7,
    isTanOriginal: false
  },
  {
    id: 'custom-egg-white',
    name: '自选-蛋白（个/30g）',
    category: '肉蛋鱼',
    unit: '个',
    baseAmount: 1,
    carbPerUnit: 0.3,
    proteinPerUnit: 3.6,
    fatPerUnit: 0.1,
    isTanOriginal: false
  },
  {
    id: 'custom-tofu',
    name: '自选-北豆腐',
    category: '肉蛋鱼',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 3.5,
    proteinPerUnit: 8.1,
    fatPerUnit: 3.7,
    isTanOriginal: false
  },
  {
    id: 'custom-milk',
    name: '自选-纯牛奶',
    category: '其他',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 5,
    proteinPerUnit: 3.2,
    fatPerUnit: 3.8,
    isTanOriginal: false
  },
  {
    id: 'custom-banana',
    name: '自选-香蕉（带皮称）',
    category: '蔬菜/水果',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 22.8,
    proteinPerUnit: 1.1,
    fatPerUnit: 0.3,
    isTanOriginal: false
  },
  {
    id: 'custom-avocado',
    name: '自选-牛油果',
    category: '油脂',
    unit: '100g',
    baseAmount: 100,
    carbPerUnit: 8.5,
    proteinPerUnit: 2,
    fatPerUnit: 14.7,
    isTanOriginal: false
  }
];
