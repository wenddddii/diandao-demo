import EPub from 'epub';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EPUB_PATH =
  '/Users/inbunye/Downloads/尼罗河上的惨案 (（英）阿加莎·克里斯蒂著；张乐敏译) (z-library.sk, 1lib.sk, z-lib.sk).epub';

const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'bookData.json');

function stripHtml(html) {
  if (!html) return '';
  // 尝试保留段落边界：将<p>等块级标签转成换行，再去掉剩余标签
  return html
    .replace(/<\s*(p|div|br|h[1-6])[^>]*>/gi, '\n')
    .replace(/<\s*\/\s*(p|div|h[1-6])\s*>/gi, '\n')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

console.log('Parsing EPUB from:', EPUB_PATH);

async function main() {
  try {
    const epub = new EPub(EPUB_PATH);
    await epub.parse();

    const flow = epub.flow || [];
    if (!flow.length) {
      console.error('No chapter flow found in EPUB.');
      process.exit(1);
    }

    const chapters = [];
    for (let index = 0; index < flow.length; index++) {
      const item = flow[index];
      try {
        const text = await epub.getChapterRaw(item.id);
        const content = stripHtml(text || '');
        chapters.push({
          id: index + 1,
          title: item.title || `第${index + 1}章`,
          href: item.href,
          content
        });
      } catch (err) {
        console.warn('Failed to get chapter', item.id, err);
      }
    }

    chapters.sort((a, b) => a.id - b.id);

    const bookJson = {
      title:
        epub.metadata && epub.metadata.title
          ? epub.metadata.title
          : '尼罗河上的惨案',
      author:
        epub.metadata && epub.metadata.creator
          ? epub.metadata.creator
          : '阿加莎·克里斯蒂',
      chapters
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(bookJson, null, 2), 'utf8');
    console.log(`Extracted ${chapters.length} chapters to ${OUTPUT_PATH}`);
  } catch (err) {
    console.error('EPUB parse error:', err);
    process.exit(1);
  }
}

main();
