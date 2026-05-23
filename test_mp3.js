const fetch = require('node-fetch');
async function test() {
  const query = 'ONE PIECE';
  const res = await fetch('https://mangapill.com/search?q=' + encodeURIComponent(query));
  const html = await res.text();
  const altRegex = /<a[^>]+href="\/manga\/(\d+\/[^"]+)"/g;
  const ids = [...html.matchAll(altRegex)].map(m => m[1]);
  const uniqueIds = Array.from(new Set(ids));
  console.log('Search unique IDs:', uniqueIds.slice(0, 5));

  if (uniqueIds.length) {
    const chRes = await fetch('https://mangapill.com/manga/' + uniqueIds[0]);
    const chHtml = await chRes.text();
    const regex = /<a[^>]+href="\/chapters\/([^"]+)"[^>]*>Chapter\s+(\d+(\.\d+)?)<\/a>/gi;
    let match;
    let chapters = [];
    while ((match = regex.exec(chHtml)) !== null) {
      chapters.push(match[1]);
    }
    console.log('Chapters found:', chapters.length);
  }
}
test().catch(console.error);
