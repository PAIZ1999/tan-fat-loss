import React, { useState, useEffect } from 'react';
import { Gender, WORKOUT_PRESETS } from '../utils/calculator';
import { Dumbbell, Sliders, Scale, ChevronDown, ChevronUp } from 'lucide-react';

interface UserStatsFormProps {
  gender: Gender;
  weightKg: number;
  workoutPresetId: string;
  carbAdj: number;
  proteinAdj: number;
  fatAdj: number;
  onGenderChange: (g: Gender) => void;
  onWeightChange: (w: number) => void;
  onWorkoutChange: (presetId: string) => void;
  onCarbAdjChange: (adj: number) => void;
  onProteinAdjChange: (adj: number) => void;
  onFatAdjChange: (adj: number) => void;
}

export const UserStatsForm: React.FC<UserStatsFormProps> = ({
  gender,
  weightKg,
  workoutPresetId,
  carbAdj,
  proteinAdj,
  fatAdj,
  onGenderChange,
  onWeightChange,
  onWorkoutChange,
  onCarbAdjChange,
  onProteinAdjChange,
  onFatAdjChange,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localWeight, setLocalWeight] = useState<string>(String(weightKg));

  useEffect(() => {
    setLocalWeight(String(weightKg));
  }, [weightKg]);

  const handleWeightInputChange = (val: string) => {
    setLocalWeight(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 20 && num <= 250) {
      onWeightChange(num);
    }
  };

  const handleWeightBlur = () => {
    const num = parseFloat(localWeight);
    if (isNaN(num) || num < 30 || num > 200) {
      const fallback = Math.max(30, Math.min(200, isNaN(num) ? 65 : num));
      setLocalWeight(String(fallback));
      onWeightChange(fallback);
    } else {
      setLocalWeight(String(num));
      onWeightChange(num);
    }
  };

  return (
    <div className="glass-card rounded-xl p-3 mb-2.5 border border-slate-800/80">
      {/* 第一行：性别 + 体重 + 训练频次 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
        {/* 性别选择 */}
        <div className="md:col-span-3 flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 h-9">
          <button
            type="button"
            onClick={() => onGenderChange('男')}
            className={`flex-1 h-7 text-xs font-bold rounded-lg transition-all flex items-center justify-center ${
              gender === '男'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            男士
          </button>
          <button
            type="button"
            onClick={() => onGenderChange('女')}
            className={`flex-1 h-7 text-xs font-bold rounded-lg transition-all flex items-center justify-center ${
              gender === '女'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            女士
          </button>
        </div>

        {/* 体重选择 */}
        <div className="md:col-span-4 flex items-center gap-2 bg-slate-900/90 px-2.5 rounded-xl border border-slate-800 h-9">
          <Scale className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="text-xs text-slate-400 flex-shrink-0 font-medium">体重:</span>
          <input
            type="range"
            min="40"
            max="130"
            step="0.5"
            value={weightKg}
            onChange={(e) => onWeightChange(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 h-1 bg-slate-800 rounded-lg cursor-pointer min-w-0"
          />
          <div className="flex items-center bg-slate-950/90 px-1.5 py-0.5 rounded-lg border border-slate-700/80 focus-within:border-emerald-500 flex-shrink-0">
            <input
              type="number"
              min="30"
              max="200"
              step="0.5"
              value={localWeight}
              onChange={(e) => handleWeightInputChange(e.target.value)}
              onBlur={handleWeightBlur}
              className="w-11 bg-transparent text-emerald-400 font-black text-xs sm:text-sm text-center focus:outline-none font-mono"
            />
            <span className="text-[11px] text-slate-400 font-bold ml-0.5">kg</span>
          </div>
        </div>

        {/* 训练强度下拉或卡片 */}
        <div className="md:col-span-5 flex items-center gap-2">
          <div className="flex-1 bg-slate-900/90 px-3 rounded-xl border border-slate-800 flex items-center gap-2 h-9">
            <Dumbbell className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <select
              value={workoutPresetId}
              onChange={(e) => onWorkoutChange(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              {WORKOUT_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-slate-900 text-slate-200">
                  {preset.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-9 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition-all flex-shrink-0 font-medium"
            title="高级碳/蛋/脂调节"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">微调</span>
            {showAdvanced ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* 展开的微调高级设置 */}
      {showAdvanced && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-900/50 p-2.5 rounded-xl">
          <div className="flex items-center justify-between bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">碳水调节:</span>
            <div className="flex items-center gap-2">
              <button onClick={() => onCarbAdjChange(Math.round((carbAdj - 0.1) * 10) / 10)} className="w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded font-bold text-slate-300 flex items-center justify-center">-</button>
              <span className="font-mono font-bold text-emerald-400">{carbAdj > 0 ? `+${carbAdj}` : carbAdj}</span>
              <button onClick={() => onCarbAdjChange(Math.round((carbAdj + 0.1) * 10) / 10)} className="w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded font-bold text-slate-300 flex items-center justify-center">+</button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">蛋白质调节:</span>
            <div className="flex items-center gap-2">
              <button onClick={() => onProteinAdjChange(Math.round((proteinAdj - 0.1) * 10) / 10)} className="w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded font-bold text-slate-300 flex items-center justify-center">-</button>
              <span className="font-mono font-bold text-rose-400">{proteinAdj > 0 ? `+${proteinAdj}` : proteinAdj}</span>
              <button onClick={() => onProteinAdjChange(Math.round((proteinAdj + 0.1) * 10) / 10)} className="w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded font-bold text-slate-300 flex items-center justify-center">+</button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">脂肪调节:</span>
            <div className="flex items-center gap-2">
              <button onClick={() => onFatAdjChange(Math.round((fatAdj - 0.1) * 10) / 10)} className="w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded font-bold text-slate-300 flex items-center justify-center">-</button>
              <span className="font-mono font-bold text-amber-400">{fatAdj > 0 ? `+${fatAdj}` : fatAdj}</span>
              <button onClick={() => onFatAdjChange(Math.round((fatAdj + 0.1) * 10) / 10)} className="w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded font-bold text-slate-300 flex items-center justify-center">+</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

