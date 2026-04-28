import { RECAP_SYSTEM, recapUserPrompt, QA_SYSTEM, qaUserPrompt } from './prompts';

const API_BASE = 'https://api.deepseek.com';
const MODEL = 'deepseek-chat';

function buildExcerpt(readChapters, maxChars = 12000) {
  const parts = [];
  let used = 0;
  for (const ch of readChapters) {
    const header = `【第${ch.id}章·${ch.title}】\n`;
    const remain = maxChars - used - header.length;
    if (remain <= 0) break;
    const body = ch.content.slice(0, remain);
    parts.push(header + body + '\n\n');
    used += header.length + body.length;
  }
  return parts.join('').trim();
}

async function requestDeepseek(messages, { maxTokens = 512, temperature = 0.3 } = {}) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('NO_API_KEY');

  const resp = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`DEEPSEEK_ERROR: ${resp.status} ${text}`);
  }
  const data = await resp.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

export async function getLLMRecap(readChapters) {
  const excerpt = buildExcerpt(readChapters);
  if (!excerpt) {
    return '你还没有开始阅读，等你读完第一章，我会为你生成一段不含剧透的前情提要。';
  }

  const messages = [
    { role: 'system', content: RECAP_SYSTEM },
    { role: 'user', content: recapUserPrompt(excerpt) },
  ];
  const content = await requestDeepseek(messages, { maxTokens: 260, temperature: 0.2 });
  return content || '当前已读内容较短，暂时无法给出更完整的前情提要。';
}

export async function getLLMAnswer(question, readChapters, progressChapterId) {
  const excerpt = buildExcerpt(readChapters);

  const messages = [
    { role: 'system', content: QA_SYSTEM },
    { role: 'user', content: qaUserPrompt(question, excerpt, progressChapterId) },
  ];
  const content = await requestDeepseek(messages, { maxTokens: 380, temperature: 0.25 });
  return content || '根据目前已读内容，原文尚未给出足够信息来回答这个问题。';
}
