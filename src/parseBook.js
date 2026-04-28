// 匹配中文小说常见章节标题：第X章、第X节、第X回（支持汉字数字和阿拉伯数字）
const CHAPTER_RE = /^第[一二三四五六七八九十百千万\d零○]+[章节回]/;

export function parseTxtBook(text, filename = '未命名书籍') {
  const title = filename.replace(/\.txt$/i, '');
  const lines = text.split('\n');

  const chapters = [];
  let current = null;
  let id = 1;

  for (const line of lines) {
    const trimmed = line.trim();
    if (CHAPTER_RE.test(trimmed)) {
      if (current) {
        current.content = current.content.trim();
        chapters.push(current);
      }
      current = { id: id++, title: trimmed, content: '' };
    } else if (current) {
      current.content += line + '\n';
    }
  }

  if (current) {
    current.content = current.content.trim();
    chapters.push(current);
  }

  // 如果没有识别到任何章节标题，整本作为单章
  if (chapters.length === 0) {
    chapters.push({ id: 1, title: title, content: text.trim() });
  }

  return { title, author: '', chapters };
}
