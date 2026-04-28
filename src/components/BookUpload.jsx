import { useRef } from 'react';
import { parseTxtBook } from '../parseBook';

export default function BookUpload({ onUpload, onUseDefault }) {
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const book = parseTxtBook(e.target.result, file.name);
      onUpload(book);
    };
    reader.readAsText(file, 'utf-8');
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6">
      <div className="text-center space-y-1.5">
        <h1 className="text-3xl font-semibold tracking-widest text-zinc-800">点道</h1>
        <p className="text-sm text-zinc-400 tracking-wide">零剧透 AI 阅读伴侣</p>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
        >
          上传 TXT 书籍开始阅读
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".txt"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          onClick={onUseDefault}
          className="text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-600 transition-colors"
        >
          使用《尼罗河上的惨案》体验
        </button>
      </div>
    </div>
  );
}
