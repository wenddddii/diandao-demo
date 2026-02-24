import { useEffect, useMemo, useState } from 'react';
import { book, getReadChapters, generateRecap, answerQuestion } from './mockBookData';
import { getLLMRecap, getLLMAnswer } from './diandaoApi';

function Reader({ currentChapterId, onChangeChapter }) {
  const chapters = book.chapters;
  const currentChapter =
    chapters.find((ch) => ch.id === currentChapterId) ?? chapters[0];

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-semibold tracking-wide">
            {book.title}
          </h1>
          <span className="text-xs text-zinc-500">{book.author}</span>
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
          <h2 className="text-base font-semibold mb-2">
            {currentChapter.title}
          </h2>
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

function RecapPanel({ progressChapterId }) {
  const [recap, setRecap] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError('');
      try {
        const readChapters = getReadChapters(progressChapterId);
        const text = await getLLMRecap(readChapters, progressChapterId);
        if (!cancelled) setRecap(text);
      } catch (e) {
        if (!cancelled) {
          if (e?.message === 'NO_API_KEY') {
            setError('当前未检测到 DeepSeek API key 或开发服务器尚未重启，AI 前情提要暂不可用。');
          } else {
            setError('调用 DeepSeek 失败，AI 前情提要暂不可用。');
          }
          setRecap('当前 AI 服务未能正常工作，无法生成前情提要，请检查 API 配置后刷新页面。');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [progressChapterId]);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-800">AI 前情提要</h3>
        <span className="text-[11px] text-zinc-400">
          严格基于已读至第{progressChapterId}章
        </span>
      </div>
      <div className="bg-white/90 border border-zinc-200 rounded-xl px-3 py-3 text-xs leading-relaxed text-zinc-700 shadow-[0_0_0_1px_rgba(0,0,0,0.01)] min-h-[72px]">
        {loading ? '正在基于已读内容生成前情提要…' : recap}
      </div>
      {error && (
        <p className="text-[11px] text-amber-500">
          {error}
        </p>
      )}
    </section>
  );
}

function QAPanel({ progressChapterId }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [asking, setAsking] = useState(false);

  const handleAsk = () => {
    if (!input.trim()) return;
    (async () => {
      setAsking(true);
      const readChapters = getReadChapters(progressChapterId);
      let result;
      try {
        const llmAnswer = await getLLMAnswer(input, readChapters, progressChapterId);
        result = {
          answer: llmAnswer,
          scopeNote: `回答仅基于目前已读至第${progressChapterId}章的内容，由 DeepSeek 按零剧透规则生成。`,
          citations: []
        };
      } catch (e) {
        result = {
          answer:
            '当前 DeepSeek API 未能正常工作，暂时无法基于原文进行问答。请检查 API key 配置（.env 中 VITE_DEEPSEEK_API_KEY）后重启开发服务器并刷新页面。',
          scopeNote:
            '未能连接 DeepSeek，本次没有使用本地检索或摘要进行模拟回答，以避免与正式逻辑不一致。',
          citations: []
        };
      } finally {
        setAsking(false);
      }

      setHistory((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          question: input,
          answer: result.answer,
          scopeNote: result.scopeNote,
          citations: result.citations
        }
      ]);
      setInput('');
    })();
  };

  return (
    <section className="flex flex-col h-[60%]">
      <h3 className="text-sm font-semibold text-zinc-800 mb-2">AI 问答 · 点道</h3>
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            placeholder="问点什么，例如：波洛是谁？这艘游船之前有没有出过事？"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />
          <button
            onClick={handleAsk}
            className="px-3 py-2 text-xs rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            disabled={asking}
          >
            {asking ? '思考中…' : '提问'}
          </button>
        </div>
        <p className="text-[11px] text-zinc-400">
          仅基于你已读内容作答，如问题涉及未读部分或潜在剧透，会直接提示并拒绝透露细节。
        </p>
        <div className="mt-2 flex-1 overflow-y-auto space-y-3 pr-1 reader-scrollbar">
          {history.length === 0 && (
            <div className="text-[11px] text-zinc-400 border border-dashed border-zinc-200 rounded-lg px-3 py-3 bg-white/60">
              暂无对话。你可以尝试问：<br />
              · 「莉奈特是怎样的人？」<br />
              · 「波洛有没有已经怀疑谁？」（会提示涉及未读部分）<br />
            </div>
          )}
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white/90 border border-zinc-200 rounded-xl px-3 py-2 text-xs space-y-1"
            >
              <div className="font-medium text-zinc-800">你：{item.question}</div>
              <div className="text-zinc-700 whitespace-pre-wrap">{item.answer}</div>
              <div className="text-[10px] text-emerald-600 mt-1">
                {item.scopeNote}
              </div>
              {item.citations?.length > 0 && (
                <div className="text-[10px] text-zinc-400">
                  原文位置：
                  {item.citations
                    .map((c) => `第${c.chapterId}章「${c.chapterTitle}」`)
                    .join('；')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Sidebar({ progressChapterId, onChangeProgress }) {
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
            <span className="font-semibold text-emerald-600">
              {progressChapterId}
            </span>
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
        <RecapPanel progressChapterId={progressChapterId} />
        <QAPanel progressChapterId={progressChapterId} />
      </div>
    </aside>
  );
}

export default function App() {
  const [progressChapterId, setProgressChapterId] = useState(2);

  const readChapters = useMemo(
    () => getReadChapters(progressChapterId),
    [progressChapterId]
  );
  const currentChapterId =
    readChapters.length > 0 ? readChapters[readChapters.length - 1].id : 1;

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="flex-1 flex max-h-screen bg-paper">
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-5xl bg-[#fdfaf3] shadow-[0_0_30px_rgba(0,0,0,0.04)] rounded-[24px] my-4 overflow-hidden border border-zinc-200/70 flex">
            <Reader
              currentChapterId={currentChapterId}
              onChangeChapter={setProgressChapterId}
            />
            <Sidebar
              progressChapterId={progressChapterId}
              onChangeProgress={setProgressChapterId}
            />
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm border border-zinc-200/50 rounded-lg px-3 py-2 text-xs text-zinc-600 shadow-sm">
        本页面作者：叶韵雯（wendi_ye@126.com）<br/>
        仅为概念展示，借助DeepSeek大模型功能<br/>
        不对AI生成内容负责<br/>
        最新修改：2026年2月
      </div>
    </div>
  );
}
