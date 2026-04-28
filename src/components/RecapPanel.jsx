import { useEffect, useState } from 'react';
import { getLLMRecap } from '../diandaoApi';

export default function RecapPanel({ readChapters, progressChapterId }) {
  const [recap, setRecap] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError('');
      try {
        const text = await getLLMRecap(readChapters);
        if (!cancelled) setRecap(text);
      } catch (e) {
        if (!cancelled) {
          if (e?.message === 'NO_API_KEY') {
            setError('未检测到 DeepSeek API key，AI 前情提要暂不可用。');
          } else {
            setError('调用 DeepSeek 失败，AI 前情提要暂不可用。');
          }
          setRecap('当前 AI 服务未能正常工作，请检查 API 配置后刷新页面。');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [progressChapterId]);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-800">AI 前情提要 · 点道</h3>
        <span className="text-[11px] text-zinc-400">
          基于你的阅读进度：第{progressChapterId}章
        </span>
      </div>
      <div className="bg-white/90 border border-zinc-200 rounded-xl px-3 py-3 text-xs leading-relaxed text-zinc-700 shadow-[0_0_0_1px_rgba(0,0,0,0.01)] min-h-[72px]">
        {loading ? '正在基于已读内容生成前情提要…' : recap}
      </div>
      {error && (
        <p className="text-[11px] text-amber-500">{error}</p>
      )}
    </section>
  );
}
