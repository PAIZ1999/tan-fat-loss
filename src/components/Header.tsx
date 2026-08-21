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
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-6 py-2 mb-3">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/20 text-slate-950 font-black flex-shrink-0">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-slate-100 tracking-tight flex items-center gap-2">
              派的减脂助手
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                谭成义理论版
              </span>
            </h1>
          </div>
        </div>

        {/* 右侧：日期选择与离线工具 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <input
              type="date"
              value={currentDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer font-mono"
            />
          </div>

          <button
            onClick={onOpenFoodLibrary}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs flex items-center gap-1 font-semibold transition-all"
            title="食材字典"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">食材库</span>
          </button>

          <button
            onClick={onExportData}
            title="备份数据"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onImportData}
            title="恢复数据"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResetDay}
            title="重置清空"
            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

