import { useEffect } from 'react';

// ── 微信读书通用 UI 组件 ──────────────────────────────────────

function StatusBar() {
  return (
    <div className="flex justify-between items-center px-4 pt-2.5 pb-1 text-[9px] font-semibold text-zinc-800 bg-white flex-shrink-0">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <rect x="0" y="3" width="2" height="5" rx="0.5" fill="currentColor" />
          <rect x="3" y="2" width="2" height="6" rx="0.5" fill="currentColor" />
          <rect x="6" y="1" width="2" height="7" rx="0.5" fill="currentColor" />
          <rect x="9" y="0" width="2" height="8" rx="0.5" fill="currentColor" />
        </svg>
        <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
          <rect x="0" y="2" width="12" height="6" rx="1" stroke="currentColor" strokeWidth="1" fill="none" />
          <rect x="12.5" y="3.5" width="1.5" height="3" rx="0.5" fill="currentColor" />
          <rect x="1" y="3" width="9" height="4" rx="0.5" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

function TopBar({ title = '尼罗河上的惨案', subtitle }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-zinc-100 flex-shrink-0">
      <span className="text-zinc-400 text-base leading-none">‹</span>
      <div className="text-center">
        <div className="text-[11px] text-zinc-700 font-medium">{title}</div>
        {subtitle && <div className="text-[9px] text-zinc-400">{subtitle}</div>}
      </div>
      <span className="text-zinc-400 text-[13px] tracking-tighter">···</span>
    </div>
  );
}

function BottomBar({ active }) {
  const tabs = [
    { id: 'toc', label: '目录', icon: <IconToc /> },
    { id: 'font', label: '字体', icon: <IconFont /> },
    { id: 'ai', label: 'AI问答', icon: <IconAI /> },
    { id: 'bookmark', label: '收藏', icon: <IconBookmark /> },
    { id: 'more', label: '更多', icon: <IconMore /> },
  ];
  return (
    <div className="flex justify-around items-center px-1 py-1.5 bg-white border-t border-zinc-100 flex-shrink-0">
      {tabs.map((t) => (
        <div key={t.id} className={`flex flex-col items-center gap-0.5 ${active === t.id ? 'text-emerald-500' : 'text-zinc-400'}`}>
          <div className="w-4 h-4 flex items-center justify-center">{t.icon}</div>
          <span className="text-[8px]">{t.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── 图标 ──────────────────────────────────────────────────────

function IconToc() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
      <rect x="2" y="3" width="12" height="1.5" rx="0.75" />
      <rect x="2" y="7" width="9" height="1.5" rx="0.75" />
      <rect x="2" y="11" width="10.5" height="1.5" rx="0.75" />
    </svg>
  );
}
function IconFont() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
      <text x="1" y="12" fontSize="8" fontWeight="bold">A</text>
      <text x="7" y="13" fontSize="10" fontWeight="bold">A</text>
    </svg>
  );
}
function IconAI() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
      <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm0 1a5.5 5.5 0 110 11 5.5 5.5 0 010-11z" />
      <path d="M6 6.5h4M6 9.5h2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
function IconBookmark() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-full h-full">
      <path d="M4 2h8v12l-4-3-4 3V2z" />
    </svg>
  );
}
function IconMore() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
      <circle cx="4" cy="8" r="1.2" />
      <circle cx="8" cy="8" r="1.2" />
      <circle cx="12" cy="8" r="1.2" />
    </svg>
  );
}

// ── 手机外壳 ──────────────────────────────────────────────────

function Phone({ label, index, children }) {
  return (
    <div className="flex flex-col items-center gap-3 flex-shrink-0">
      <div className="text-[11px] font-medium text-zinc-400 tracking-wide">场景 {index}</div>
      <div className="text-[12px] font-semibold text-zinc-700 text-center leading-snug px-2">{label}</div>
      <div
        className="relative flex flex-col overflow-hidden shadow-2xl flex-shrink-0"
        style={{
          width: 210,
          height: 454,
          borderRadius: 32,
          border: '2.5px solid #1c1c1e',
          background: '#fff',
        }}
      >
        {/* 刘海 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-5 bg-[#1c1c1e] rounded-b-2xl z-10" />
        <div className="flex flex-col h-full pt-4">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── 场景一：久别重读弹出 AI 回顾 ──────────────────────────────

function Scene1() {
  return (
    <Phone label="久别重读 · AI 前情提要" index="一">
      <StatusBar />
      <TopBar />
      {/* 正文内容（模糊遮罩效果） */}
      <div className="relative flex-1 overflow-hidden bg-[#fdf6e3]">
        <div className="px-4 pt-3 space-y-1.5 blur-[1.5px] opacity-60 select-none">
          {[
            '    波洛注视着眼前这片古老的土地，心中涌起一种难以名状的情绪。尼罗河的水流依旧平静，但船上的',
            '气氛却已悄然改变。林奈特坐在甲板上，手中握着一本书，却始终未曾翻页。',
            '    "有什么让你心烦的事吗？"科内尔医生走近，轻声问道。',
            '    她抬起头，勉强一笑："没什么，只是觉得……"',
          ].map((t, i) => (
            <p key={i} className="text-[9px] text-zinc-700 leading-relaxed">{t}</p>
          ))}
        </div>

        {/* 弹出卡片 */}
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.12)] p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">AI</span>
            </div>
            <span className="text-[10px] font-semibold text-zinc-700">57 天未打开此书</span>
            <span className="text-[9px] text-zinc-400 ml-auto">已读至第13章</span>
          </div>
          <div className="bg-zinc-50 rounded-xl p-2 space-y-1">
            <div className="text-[9px] text-zinc-400 font-medium">AI 前情提要</div>
            <p className="text-[8.5px] text-zinc-600 leading-relaxed">
              林奈特·里奇威与好友姬达一行人登上了尼罗河游轮卡纳克号。波洛也碰巧同船，途中发现姬达的旧情人科内尔上校也在船上，局势渐趋紧张……
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-1.5 rounded-lg bg-emerald-500 text-white text-[9px] font-medium">
              继续阅读
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-500 text-[9px]">
              关闭
            </button>
          </div>
        </div>
      </div>
      <BottomBar />
    </Phone>
  );
}

// ── 场景二：AI 问答 · 一键防剧透 ────────────────────────────

function Scene2() {
  return (
    <Phone label="AI 问答 · 一键防剧透" index="二">
      <StatusBar />
      <TopBar title="AI 问答" subtitle="尼罗河上的惨案" />

      {/* 防剧透开关 */}
      <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 border-b border-emerald-100 flex-shrink-0">
        <div>
          <div className="text-[10px] font-semibold text-emerald-700">防剧透模式</div>
          <div className="text-[8.5px] text-emerald-500">仅基于已读至第13章的内容作答</div>
        </div>
        {/* Toggle ON */}
        <div className="w-8 h-4.5 rounded-full bg-emerald-500 flex items-center justify-end pr-0.5 flex-shrink-0" style={{ height: 18, paddingRight: 2 }}>
          <div className="w-3.5 h-3.5 rounded-full bg-white shadow-sm" />
        </div>
      </div>

      {/* 对话区 */}
      <div className="flex-1 overflow-hidden px-2 py-2 space-y-2 bg-zinc-50">
        {/* AI 消息 */}
        <div className="flex gap-1.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center">
            <span className="text-white text-[7px] font-bold">AI</span>
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-2 py-1.5 max-w-[75%] shadow-sm">
            <p className="text-[8.5px] text-zinc-600 leading-relaxed">你好！有什么关于这本书的问题？防剧透模式已开启，我只会回答你已读到的内容。</p>
          </div>
        </div>
        {/* 用户消息 */}
        <div className="flex justify-end">
          <div className="bg-emerald-500 rounded-2xl rounded-tr-sm px-2 py-1.5 max-w-[70%]">
            <p className="text-[8.5px] text-white leading-relaxed">波洛是谁？</p>
          </div>
        </div>
        {/* AI 回答 */}
        <div className="flex gap-1.5">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center">
            <span className="text-white text-[7px] font-bold">AI</span>
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-2 py-1.5 max-w-[75%] shadow-sm">
            <p className="text-[8.5px] text-zinc-600 leading-relaxed">赫尔克里·波洛是比利时裔侦探，以缜密的逻辑著称。他在第一章中出现，在英国结识了当时尚未嫁给里奇威的林奈特……</p>
          </div>
        </div>
      </div>

      {/* 输入框 */}
      <div className="flex gap-1.5 px-2 py-1.5 bg-white border-t border-zinc-100 flex-shrink-0">
        <div className="flex-1 bg-zinc-100 rounded-full px-2.5 py-1 text-[8.5px] text-zinc-400">
          输入你的问题…
        </div>
        <button className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 12 12" fill="white" className="w-3 h-3">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </button>
      </div>
      <BottomBar active="ai" />
    </Phone>
  );
}

// ── 场景三：进入问答页自动弹出 AI 回顾 ──────────────────────

function Scene3() {
  return (
    <Phone label="进入AI问答 · 自动弹出回顾" index="三">
      <StatusBar />
      <TopBar title="AI 问答" subtitle="尼罗河上的惨案" />

      {/* 自动弹出的回顾卡片 */}
      <div className="mx-2 mt-2 bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl p-2.5 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="text-white text-[7px] font-bold">AI</span>
          </div>
          <span className="text-[9.5px] font-semibold text-emerald-700">已为你整理已读内容</span>
          <button className="ml-auto text-zinc-300 text-[10px] leading-none">×</button>
        </div>
        <p className="text-[8px] text-zinc-500 mb-0.5">已读至第 13 章 · 上次阅读：3天前</p>
        <p className="text-[8.5px] text-zinc-600 leading-relaxed line-clamp-3">
          林奈特·里奇威与好友姬达一行人登上了尼罗河游轮卡纳克号。波洛也碰巧同船，途中发现姬达的旧情人科内尔上校也在船上，局势渐趋紧张……
        </p>
        <button className="mt-1.5 text-[8.5px] text-emerald-500 font-medium">展开全文 ›</button>
      </div>

      {/* 对话区（空状态） */}
      <div className="flex-1 flex flex-col items-center justify-center bg-zinc-50 gap-2 px-4">
        <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center">
          <svg viewBox="0 0 16 16" className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M2 4h12v7a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
            <path d="M5 12l-1 2M11 12l1 2" />
          </svg>
        </div>
        <p className="text-[9px] text-zinc-400 text-center leading-relaxed">
          基于已读内容提问<br />AI 会严格避免剧透
        </p>
      </div>

      {/* 输入框 */}
      <div className="flex gap-1.5 px-2 py-1.5 bg-white border-t border-zinc-100 flex-shrink-0">
        <div className="flex-1 bg-zinc-100 rounded-full px-2.5 py-1 text-[8.5px] text-zinc-400">
          输入你的问题…
        </div>
        <button className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 12 12" fill="white" className="w-3 h-3">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </svg>
        </button>
      </div>
      <BottomBar active="ai" />
    </Phone>
  );
}

// ── 主弹窗 ────────────────────────────────────────────────────

export default function ConceptModal({ onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl flex overflow-hidden"
        style={{ width: '90vw', maxWidth: 1000, height: '82vh', maxHeight: 680 }}>

        {/* 左侧说明区（1/4） */}
        <div className="w-1/4 flex-shrink-0 border-r border-zinc-100 bg-zinc-50/70 flex flex-col px-5 py-6 gap-4 overflow-y-auto">
          <div>
            <div className="text-[10px] font-semibold text-zinc-400 tracking-widest uppercase mb-1">产品思路</div>
            <h2 className="text-base font-semibold text-zinc-800 leading-snug">点道如何嵌入现有阅读 App？</h2>
          </div>

          <div className="space-y-4 text-[11.5px] text-zinc-500 leading-relaxed">
            <p>
              点道的核心能力是<span className="text-zinc-700 font-medium">「以阅读进度为边界的 AI 问答与回顾」</span>，可以通过以下路径集成进微信读书等成熟阅读产品：
            </p>

            <div className="space-y-3">
              <div>
                <div className="text-zinc-700 font-semibold mb-0.5">场景一</div>
                <p>
                  用户久别重读某本书时，App 检测到「上次阅读距今超过 N 天」，在进入阅读页时自动弹出 AI 前情提要侧边栏，帮助用户快速唤醒记忆、无缝衔接。
                </p>
              </div>
              <div>
                <div className="text-zinc-700 font-semibold mb-0.5">场景二</div>
                <p>
                  在已有的 AI 问答页面中新增「防剧透模式」开关。开启后，AI 的信息边界自动锁定在用户当前阅读进度，确保不提前泄露后续情节。
                </p>
              </div>
              <div>
                <div className="text-zinc-700 font-semibold mb-0.5">场景三</div>
                <p>
                  用户进入 AI 问答页面时，自动在对话顶部弹出一张已读内容回顾卡片，让用户在提问前快速对齐上下文，提升问答质量。
                </p>
              </div>
            </div>

            <p className="text-zinc-400 text-[10.5px]">
              以下原型基于微信读书 UI 风格绘制，仅作概念展示。
            </p>
          </div>
        </div>

        {/* 右侧原型区（3/4） */}
        <div className="flex-1 flex flex-col px-6 py-6 min-w-0">
          <div className="flex items-center justify-between mb-5 flex-shrink-0">
            <div>
              <h3 className="text-sm font-semibold text-zinc-800">集成场景高保真原型</h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">微信读书风格 · 左右滑动查看</p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 text-sm transition-colors flex-shrink-0"
            >
              ×
            </button>
          </div>

          {/* 手机原型横向滑动区 */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-10 items-center h-full px-2 pb-2" style={{ minWidth: 'max-content' }}>
              <Scene1 />
              <Scene2 />
              <Scene3 />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
