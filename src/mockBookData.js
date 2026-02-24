import bookData from './bookData.json';

export const book = bookData;

const SPOILER_KEYWORDS = ['凶手', '真相', '结局', '最后', '幕后黑手', '谁杀', '侦破', '破案'];

export function getReadChapters(progressChapterId) {
  return book.chapters.filter((ch) => ch.id <= progressChapterId);
}

export function generateRecap(progressChapterId) {
  const readChapters = getReadChapters(progressChapterId);
  if (readChapters.length === 0) {
    return '你还没有开始阅读，等你读完第一章，我会为你生成一段不含剧透的前情提要。';
  }
  const pieces = readChapters.map((ch) => {
    const snippet = ch.content.slice(0, 80).replace(/\s+/g, ' ');
    return `【第${ch.id}章·${ch.title}】${snippet}`;
  });
  const text = pieces.join(' ');
  return text.slice(0, 200);
}

function findEntitySnippets(readChapters, keyword) {
  const results = [];
  for (const ch of readChapters) {
    const idx = ch.content.indexOf(keyword);
    if (idx !== -1) {
      const start = Math.max(0, idx - 30);
      const end = Math.min(ch.content.length, idx + keyword.length + 30);
      results.push({
        chapterId: ch.id,
        chapterTitle: ch.title,
        snippet: ch.content.slice(start, end)
      });
    }
  }
  return results;
}

export function answerQuestion(question, progressChapterId) {
  const q = question.trim();
  const readChapters = getReadChapters(progressChapterId);

  if (!q) {
    return {
      answer: '请先输入你想追问的问题，例如“这个角色是谁？”或“之前提到的那把枪在哪一章出现过？”。',
      scopeNote: `当前仅基于已读至第${progressChapterId}章的内容作答。`,
      citations: []
    };
  }

  if (SPOILER_KEYWORDS.some((k) => q.includes(k))) {
    return {
      answer:
        '这个问题会直接涉及你尚未阅读的后续情节或案件真相，为避免剧透，我不会回答具体结果。' +
        '我可以帮你回顾目前已读章节中出现的主要人物、矛盾与线索，供你自行推理。',
      scopeNote: `严格限制在第${progressChapterId}章及之前的内容；不会透露后续走向。`,
      citations: []
    };
  }

  const entities = ['波洛', '莉奈特', '西蒙', '游船', '尼罗河'];
  for (const name of entities) {
    if (q.includes(name)) {
      const hits = findEntitySnippets(readChapters, name);
      if (hits.length > 0) {
        const first = hits[0];
        return {
          answer: `${name} 已在目前已读范围内出现。根据原文，Ta 在「${first.chapterTitle}」中被提及：\n\n“${first.snippet}”\n\n更详细的动机与后续发展原文尚未完全展开，属于你尚未阅读的部分，我在此不做剧透。`,
          scopeNote: `回答仅引用至第${progressChapterId}章的原文片段，不包含后续章节信息。`,
          citations: [
            {
              chapterId: first.chapterId,
              chapterTitle: first.chapterTitle
            }
          ]
        };
      }
    }
  }

  if (readChapters.length === 0) {
    return {
      answer:
        '目前你还没有开始阅读原文，所以我无法从文本中给出基于事实的回答。等你读完至少第一章后，我可以帮助你回顾已读内容，并基于原文回答问题。',
      scopeNote: '未读状态，不提供剧情与设定细节，只说明能力边界。',
      citations: []
    };
  }

  return {
    answer:
      '根据目前已读至第' +
      progressChapterId +
      '章的内容，原文中没有对这个问题给出非常明确、无歧义的说明，或者尚未展开到你提问的部分。\n\n' +
      '为了避免剧透，我不会引用后续章节的信息。如果你愿意，我可以改为帮你整理目前章节中已经出现的主要人物、矛盾与线索，供你自行判断。',
    scopeNote:
      '回答仅基于已读章节的客观事实，不推测未出现的事件，也不提前揭示后续发展。',
    citations: []
  };
}
