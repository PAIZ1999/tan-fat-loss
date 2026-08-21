import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb, Droplets, RefreshCcw } from 'lucide-react';

export const TipsCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-2.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-900/60 hover:bg-slate-900/90 rounded-xl border border-slate-800/80 text-xs text-slate-400 transition-all"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-300">谭成义减脂要点 & 用油补盐指南</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <span>{isOpen ? '收起指南' : '点击查看精简法则'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-2 p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300">
          <div className="space-y-0.5">
            <h4 className="font-bold text-emerald-400 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" /> 新手规则
            </h4>
            <p className="text-slate-400 leading-relaxed">蔬菜、坚果、南瓜籽、蓝莓新手期暂不计算成分；减脂核心是保持瘦体重。</p>
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-amber-400 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5" /> 油脂与控盐
            </h4>
            <p className="text-slate-400 leading-relaxed">推荐橄榄油、牛油果油、山茶油、低芥酸菜籽油、猪油。每日建议补盐 6-8g。</p>
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-blue-400 flex items-center gap-1">
              <RefreshCcw className="w-3.5 h-3.5" /> 10天周期
            </h4>
            <p className="text-slate-400 leading-relaxed">每 10 天称重更新，根据减脂速度微调碳水系数，太快加碳、太慢减碳。</p>
          </div>
        </div>
      )}
    </div>
  );
};

