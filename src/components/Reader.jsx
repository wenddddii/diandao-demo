export default function Reader({ book, currentChapterId, onChangeChapter }) {
  const chapters = book.chapters;
  const currentChapter = chapters.find((ch) => ch.id === currentChapterId) ?? chapters[0];

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-semibold tracking-wide">{book.title}</h1>
          {book.author && (
            <span className="text-xs text-zinc-500">{book.author}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span>当前章节</span>
          <select
            className="border border-zinc-300 rounded-md px-2 py-1 bg-white text-sm"
            value={currentChapterId}
            onChange={(e) => onChangeChapter(Number(e.target.value))}
          >
            {chapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.title}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="flex-1 px-10 py-6 overflow-y-auto reader-scrollbar">
        <article className="max-w-3xl mx-auto leading-relaxed text-[15px] text-zinc-800">
          <h2 className="text-base font-semibold mb-2">{currentChapter.title}</h2>
          <p className="whitespace-pre-wrap font-[system-ui] tracking-wide">
            {currentChapter.content}
          </p>
          <div className="mt-8 pt-4 border-t border-zinc-200 flex justify-between">
            {currentChapterId > 1 && (
              <button
                onClick={() => onChangeChapter(currentChapterId - 1)}
                className="px-4 py-2 text-sm bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-md transition-colors"
              >
                上一章
              </button>
            )}
            {currentChapterId < chapters.length && (
              <button
                onClick={() => onChangeChapter(currentChapterId + 1)}
                className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white rounded-md transition-colors ml-auto"
              >
                下一章
              </button>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
