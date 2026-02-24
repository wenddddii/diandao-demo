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
  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const resp = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: maxTokens,
      temperature
    })
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`DEEPSEEK_ERROR: ${resp.status} ${text}`);
  }
  const data = await resp.json();
  return data.choices?.[0]?.message?.content?.trim() || '';
}

export async function getLLMRecap(readChapters, progressChapterId) {
  const excerpt = buildExcerpt(readChapters);
  if (!excerpt) {
    return '你还没有开始阅读，等你读完第一章，我会为你生成一段不含剧透的前情提要。';
  }

  const systemPrompt =
    '你是“点道”AI 阅读回顾助手，负责给出严格零剧透的前情提要。\n' +
    '核心规则：\n' +
    '1. 你只能基于“已读内容”总结，不允许猜测或引用任何超出提供文本之外的剧情、设定或情节发展。\n' +
    '2. 不允许透露任何未来情节、凶手、真相、结局或人物最终命运；不要暗示或预告后续事件。\n' +
    '3. 如原文在已读部分没有给出明确信息，你只能说“原文尚未明确”或者保持沉默，不能自行脑补补全。\n' +
    '4. 输出必须控制在200字以内，语言客观、中性，只做事实性梳理，不加评价和推理。\n' +
    '5. 不要剧透、不要做任何方向性的提示，比如“真正的故事才刚刚开始”“某人将成为关键人物”等。';

  const userPrompt =
    `下面是读者目前已读到的《尼罗河上的惨案》原文节选，仅包含已读章节：\n\n` +
    `${excerpt}\n\n` +
    `请在严格不剧透的前提下，基于以上“已读内容”，用不超过200字写一段前情提要：\n` +
    `- 只总结目前已经发生、已经明示的剧情与人物关系。\n` +
    `- 不要做任何关于未来走向的推测或暗示。\n` +
    `- 不要提及“未读”“后面”“未来章节”等字眼，只当下回顾。`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const content = await requestDeepseek(messages, { maxTokens: 260, temperature: 0.2 });
  return content || '当前已读内容较短，暂时无法给出更完整的前情提要。';
}

export async function getLLMAnswer(question, readChapters, progressChapterId) {
  const excerpt = buildExcerpt(readChapters);

  const systemPrompt =
    '你是“点道”AI 阅读问答助手，职责是在严格零剧透的前提下，回答读者基于已读内容的追问。\n' +
    '总体目标：宁可不回答，也绝不剧透。\n' +
    '硬性规则：\n' +
    '1. 信息边界：你只能基于“已读内容”回答问题。假设你对后续章节一无所知。\n' +
    '2. 剧透防护：凡是涉及凶手、真相、结局、幕后黑手、是否会死、案件如何破获等未来走向的问题，一律不要直接回答，只说明“这会涉及你尚未阅读的部分”。\n' +
    '3. 不脑补：如果已读内容没有明确写出，就回答“原文尚未明确”“目前章节没有给出确定答案”，不要凭常识或推理填空。\n' +
    '4. 引用原文：在可能的情况下，优先引用已读内容中的一句或几句短原文，并用自然语言说明出自哪一章。\n' +
    '5. 说清边界：如果你拒绝回答或只能部分回答，要明确告诉读者“为了避免剧透，我只会回顾目前为止的内容”。\n' +
    '6. 语气：保持客观、冷静、不剧透，不给读者任何关于后续发展“暗示”或“引导”。';

  const userPrompt =
    `读者的问题是：${question}\n\n` +
    `下面是他目前已读到的原文节选（已读上限为第 ${progressChapterId} 章）：\n\n` +
    `${excerpt || '（目前已读内容很短或为空）'}\n\n` +
    `请根据上面的“已读内容”来回答：\n` +
    `- 优先给出客观、可在文本中找到依据的事实性回答。\n` +
    `- 如果问题明显在问后续剧情（比如“凶手是谁”“最后怎样”“会不会死”），请直接说明：这会涉及尚未阅读的部分，你不会透露，并改为提供“目前已读部分中已出现的相关人物、线索或设定”。\n` +
    `- 如果已读部分完全没有相关信息，只需说明：目前章节没有给出明确信息。\n` +
    `- 回答正文中如果需要引用不同位置的原文，请在相关句子后添加小脚注标记，例如“……这一点在文本中已经出现 [注1]”、“……另一个细节见 [注2]”。\n` +
    `- 在正文结束后，另起多行列出脚注，每一行格式严格为：“【注1】……”、“【注2】……”，其中“……”部分用自然语言简要说明对应引用大致出自哪些章节和情节。\n` +
    `最终请用简洁中文回答，不超过300字（不含脚注部分）。`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const content = await requestDeepseek(messages, { maxTokens: 380, temperature: 0.25 });
  return content || '根据目前已读内容，原文尚未给出足够信息来回答这个问题。';
}
