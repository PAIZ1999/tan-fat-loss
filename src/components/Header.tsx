import React from 'react';
import { Calendar, BookOpen, Download, Upload, RefreshCw, Flame } from 'lucide-react';

interface HeaderProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  onOpenFoodLibrary: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onResetDay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onDateChange,
  onOpenFoodLibrary,
  onExportData,
  onImportData,
  onResetDay,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-2.5 sm:px-6 py-2 mb-2 sm:mb-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Brand Logo & Title (100% 绝对不折行) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-slate-950 font-black flex-shrink-0">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <h1 className="font-black text-xs sm:text-sm md:text-base text-slate-100 tracking-tight whitespace-nowrap">
              派的减脂助手
            </h1>
            <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
              谭成义版
            </span>
          </div>
        </div>

        {/* 右侧：日期选择与快捷工具 */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* 日期选择器 */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-1.5 sm:px-2 py-1 text-xs text-slate-200">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 flex-shrink-0" />
            <input
              type="date"
              value={currentDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-slate-200 text-[11px] sm:text-xs focus:outline-none cursor-pointer font-mono w-[84px] sm:w-auto"
            />
          </div>

          {/* 食材库 */}
          <button
            onClick={onOpenFoodLibrary}
            className="px-1.5 sm:px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[11px] sm:text-xs flex items-center gap-1 font-semibold transition-all active:scale-95 cursor-pointer"
            title="食材库"
          >
            <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">食材库</span>
          </button>

          {/* 备份 */}
          <button
            onClick={onExportData}
            title="备份数据"
            className="p-1 sm:p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          {/* 导入 */}
          <button
            onClick={onImportData}
            title="恢复数据"
            className="p-1 sm:p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all active:scale-95 cursor-pointer"
          >
            <Upload className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>

          {/* 重置 */}
          <button
            onClick={onResetDay}
            title="重置清空"
            className="p-1 sm:p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
