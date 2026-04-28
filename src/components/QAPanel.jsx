import { useState } from 'react';
import { getLLMAnswer } from '../diandaoApi';

export default function QAPanel({ readChapters, progressChapterId }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [asking, setAsking] = useState(false);

  const handleAsk = async () => {
    if (!input.trim() || asking) return;
    const question = input;
    setInput('');
    setAsking(true);

    let entry;
    try {
      const answer = await getLLMAnswer(question, readChapters, progressChapterId);
      entry = {
        question,
        answer,
        scopeNote: `回答仅基于你的阅读进度：第${progressChapterId}章，由 DeepSeek 按零剧透规则生成。`,
      };
    } catch {
      entry = {
        question,
        answer: '当前 DeepSeek API 未能正常工作，请检查 .env 中的 VITE_DEEPSEEK_API_KEY 后重启开发服务器。',
        scopeNote: '未能连接 DeepSeek。',
      };
    } finally {
      setAsking(false);
    }

    setHistory((prev) => [...prev, entry]);
  };

  return (
    <section className="flex flex-col h-[60%]">
      <h3 className="text-sm font-semibold text-zinc-800 mb-2">AI 问答 · 点道</h3>
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            placeholder="问点什么，例如：波洛是谁？"
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
            disabled={asking}
            className="px-3 py-2 text-xs rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-60"
          >
            {asking ? '思考中…' : '提问'}
          </button>
        </div>
        <p className="text-[11px] text-zinc-400">
          仅基于你已读内容作答，涉及未读部分会直接提示并拒绝透露细节。
        </p>
        <div className="mt-2 flex-1 overflow-y-auto space-y-3 pr-1 reader-scrollbar">
          {history.length === 0 && (
            <div className="text-[11px] text-zinc-400 border border-dashed border-zinc-200 rounded-lg px-3 py-3 bg-white/60">
              暂无对话。你可以尝试问：<br />
              · 「莉奈特是怎样的人？」<br />
              · 「波洛有没有已经怀疑谁？」（会提示涉及未读部分）
            </div>
          )}
          {history.map((item, i) => (
            <div
              key={i}
              className="bg-white/90 border border-zinc-200 rounded-xl px-3 py-2 text-xs space-y-1"
            >
              <div className="font-medium text-zinc-800">你：{item.question}</div>
              <div className="text-zinc-700 whitespace-pre-wrap">{item.answer}</div>
              <div className="text-[10px] text-emerald-600 mt-1">{item.scopeNote}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
