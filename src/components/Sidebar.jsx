import RecapPanel from './RecapPanel';
import QAPanel from './QAPanel';

export default function Sidebar({ book, readChapters, progressChapterId, onChangeProgress }) {
  const total = book.chapters.length;
  const percent = Math.round((progressChapterId / total) * 100);

  return (
    <aside className="w-[320px] border-l border-zinc-200 bg-zinc-50/60 h-full flex flex-col">
      <header className="px-4 py-3 border-b border-zinc-200">
        <div className="text-xs font-semibold text-zinc-500 tracking-wide mb-1">
          点道 · 阅读进度
        </div>
        <div className="flex items-center justify-between text-sm text-zinc-800">
          <span>
            已读到第
            <span className="font-semibold text-emerald-600">{progressChapterId}</span>
            章
          </span>
          <span className="text-xs text-zinc-500">{percent}%</span>
        </div>
        <div className="mt-2">
          <input
            type="range"
            min={1}
            max={total}
            value={progressChapterId}
            onChange={(e) => onChangeProgress(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[11px] text-zinc-400 mt-1">
            <span>第1章</span>
            <span>第{total}章</span>
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col gap-4 px-4 py-3 overflow-y-auto reader-scrollbar">
        <RecapPanel readChapters={readChapters} progressChapterId={progressChapterId} />
        <QAPanel readChapters={readChapters} progressChapterId={progressChapterId} />
      </div>
    </aside>
  );
}
