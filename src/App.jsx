import { useMemo, useState } from 'react';
import bookData from './bookData.json';
import BookUpload from './components/BookUpload';
import Reader from './components/Reader';
import Sidebar from './components/Sidebar';
import ConceptModal from './components/ConceptModal';

export default function App() {
  const [book, setBook] = useState(null);
  const [progressChapterId, setProgressChapterId] = useState(1);
  const [showConcept, setShowConcept] = useState(false);

  const readChapters = useMemo(
    () => (book ? book.chapters.filter((ch) => ch.id <= progressChapterId) : []),
    [book, progressChapterId]
  );

  const handleBookLoaded = (data) => {
    setBook(data);
    setProgressChapterId(1);
  };

  if (!book) {
    return (
      <div className="w-screen h-screen flex bg-paper">
        <div className="flex-1 flex justify-center items-stretch py-4 px-4">
          <div className="w-full max-w-5xl bg-[#fdfaf3] shadow-[0_0_30px_rgba(0,0,0,0.04)] rounded-[24px] border border-zinc-200/70 flex">
            <BookUpload
              onUpload={handleBookLoaded}
              onUseDefault={() => handleBookLoaded(bookData)}
            />
          </div>
        </div>
        <ConceptButton onClick={() => setShowConcept(true)} />
        {showConcept && <ConceptModal onClose={() => setShowConcept(false)} />}
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex bg-paper">
      <div className="flex-1 flex justify-center items-stretch py-4 px-4">
        <div className="w-full max-w-5xl bg-[#fdfaf3] shadow-[0_0_30px_rgba(0,0,0,0.04)] rounded-[24px] overflow-hidden border border-zinc-200/70 flex">
          <Reader
            book={book}
            currentChapterId={progressChapterId}
            onChangeChapter={setProgressChapterId}
          />
          <Sidebar
            book={book}
            readChapters={readChapters}
            progressChapterId={progressChapterId}
            onChangeProgress={setProgressChapterId}
          />
        </div>
      </div>

      <ConceptButton onClick={() => setShowConcept(true)} />
      {showConcept && <ConceptModal onClose={() => setShowConcept(false)} />}

      <div className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm border border-zinc-200/50 rounded-lg px-3 py-2 text-xs text-zinc-600 shadow-sm">
        开发者：叶韵雯<br />
        邮箱：wendi_ye@126.com<br />
        最新修改：2026年4月
      </div>
    </div>
  );
}

function ConceptButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white border border-zinc-200 rounded-full text-xs text-zinc-600 hover:text-zinc-800 shadow-sm backdrop-blur-sm transition-all"
    >
      <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="1.5">
        <rect x="1" y="2" width="12" height="9" rx="1.5" />
        <path d="M4 11v1.5M10 11v1.5M4 12.5h6" />
      </svg>
      产品集成思路
    </button>
  );
}
