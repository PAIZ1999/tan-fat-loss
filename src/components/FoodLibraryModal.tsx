import React, { useState } from 'react';
import { FoodItem } from '../data/foodDatabase';
import { X, Plus, BookOpen, Search, Check } from 'lucide-react';

interface FoodLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  foodList: FoodItem[];
  onAddCustomFood: (food: FoodItem) => void;
}

export const FoodLibraryModal: React.FC<FoodLibraryModalProps> = ({
  isOpen,
  onClose,
  foodList,
  onAddCustomFood,
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'add'>('view');
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('全部');

  // 自定义新食物表单状态
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodItem['category']>('主食');
  const [unit, setUnit] = useState('100g');
  const [baseAmount, setBaseAmount] = useState(100);
  const [carb, setCarb] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fat, setFat] = useState(0);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const categories = ['全部', '主食', '肉蛋鱼', '油脂', '蔬菜/水果', '坚果/种子', '其他'];

  const filteredList = foodList.filter((item) => {
    const matchName = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === '全部' || item.category === filterCategory;
    return matchName && matchCat;
  });

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFood: FoodItem = {
      id: `custom-${Date.now()}`,
      name: name.startsWith('自选-') ? name : `自选-${name}`,
      category,
      unit,
      baseAmount: baseAmount || 100,
      carbPerUnit: carb,
      proteinPerUnit: protein,
      fatPerUnit: fat,
      isTanOriginal: false,
      note: note.trim() || undefined,
    };

    onAddCustomFood(newFood);

    // 重置表单
    setName('');
    setCarb(0);
    setProtein(0);
    setFat(0);
    setNote('');
    setActiveTab('view');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card w-full max-w-3xl rounded-2xl border border-slate-700 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-slate-100">
              减脂食材与营养数据字典
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switch */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-5 pt-2">
          <button
            onClick={() => setActiveTab('view')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'view'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            查看全量食材库 ({foodList.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`pb-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1 ${
              activeTab === 'add'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            新增自定义食材
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {activeTab === 'view' ? (
            <div className="space-y-4">
              {/* 搜索与分类 */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="搜索食材数据..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full glass-input pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div className="flex flex-wrap gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        filterCategory === cat
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* 食物表格 */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">食材名称</th>
                      <th className="p-3">分类</th>
                      <th className="p-3">基准单位</th>
                      <th className="p-3 text-blue-400">碳水(g)</th>
                      <th className="p-3 text-rose-400">蛋白质(g)</th>
                      <th className="p-3 text-amber-400">脂肪(g)</th>
                      <th className="p-3">备注</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredList.map((food) => (
                      <tr key={food.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-slate-100 flex items-center gap-1.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              food.isTanOriginal
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            }`}
                          >
                            {food.isTanOriginal ? '谭' : '自选'}
                          </span>
                          {food.name}
                        </td>
                        <td className="p-3 text-slate-400">{food.category}</td>
                        <td className="p-3 font-mono text-slate-300">
                          {food.unit === '个'
                            ? '1个'
                            : food.unit === '100g'
                            ? '100g'
                            : food.unit.includes('100') || food.unit.includes('个')
                            ? food.unit
                            : `${food.baseAmount || 100}${food.unit || 'g'}`}
                        </td>
                        <td className="p-3 font-mono font-bold text-blue-400">{food.carbPerUnit}</td>
                        <td className="p-3 font-mono font-bold text-rose-400">{food.proteinPerUnit}</td>
                        <td className="p-3 font-mono font-bold text-amber-400">{food.fatPerUnit}</td>
                        <td className="p-3 text-slate-400 max-w-[200px] truncate" title={food.note}>
                          {food.note || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCreateFood} className="space-y-4 max-w-xl mx-auto py-2">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  食材名称 *
                </label>
                <input
                  type="text"
                  required
                  placeholder="例如: 全麦面包 / 去皮鸡胸"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    分类
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as FoodItem['category'])}
                    className="w-full glass-input px-3 py-2 rounded-xl text-sm bg-slate-900 text-slate-100"
                  >
                    <option value="主食">主食</option>
                    <option value="肉蛋鱼">肉蛋鱼</option>
                    <option value="油脂">油脂</option>
                    <option value="蔬菜/水果">蔬菜/水果</option>
                    <option value="坚果/种子">坚果/种子</option>
                    <option value="其他">其他</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    计量单位
                  </label>
                  <input
                    type="text"
                    placeholder="100g 或 1个"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-blue-400 block mb-1">
                    碳水化合物 (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={carb}
                    onChange={(e) => setCarb(parseFloat(e.target.value) || 0)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-sm text-center font-mono font-bold text-blue-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-rose-400 block mb-1">
                    蛋白质 (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={protein}
                    onChange={(e) => setProtein(parseFloat(e.target.value) || 0)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-sm text-center font-mono font-bold text-rose-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-amber-400 block mb-1">
                    脂肪 (g)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={fat}
                    onChange={(e) => setFat(parseFloat(e.target.value) || 0)}
                    className="w-full glass-input px-3 py-2 rounded-xl text-sm text-center font-mono font-bold text-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  备注说明 (可选)
                </label>
                <input
                  type="text"
                  placeholder="可记录数据来源或烹饪烹调要点"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-sm"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Check className="w-4 h-4" />
                  保存并保存至食材库
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
