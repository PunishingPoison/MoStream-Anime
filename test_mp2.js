const fetch = require('node-fetch');
async function test() {
  const q = encodeURIComponent('One Piece');
  const res = await fetch('https://mangapill.com/search?q=' + q);
  const html = await res.text();
  const linkRegex = /<a[^>]+href="\/manga\/(\d+\/[^"]+)"[^>]*>([^<]+)<\/a>/g;
  let match;
  let results = [];
  while ((match = linkRegex.exec(html)) !== null) {
    const title = match[2].trim();
    if (title && !title.includes('<') && !title.includes('img')) {
      results.push({ id: match[1], title });
    }
  }
  const altRegex = /<a[^>]+href="\/manga\/(\d+\/[^"]+)"/g;
  if (results.length === 0) {
    const ids = [...html.matchAll(altRegex)].map(m => m[1]);
    const uniqueIds = Array.from(new Set(ids));
    results = uniqueIds.map(id => ({ id, title: q }));
  }
  console.log('Search:', results.slice(0, 2));

  if (results.length) {
    const id = results[0].id;
    const chRes = await fetch('https://mangapill.com/manga/' + id);
    const chHtml = await chRes.text();
    const chRegex = /<a[^>]+href="\/chapters\/([^"]+)"[^>]*>Chapter\s+(\d+(\.\d+)?)<\/a>/gi;
    let chMatch;
    let chs = [];
    while ((chMatch = chRegex.exec(chHtml)) !== null) {
      chs.push({ id: chMatch[1], num: chMatch[2] });
    }
    console.log('Chapters:', chs.length);

    if (chs.length) {
      const pRes = await fetch('https://mangapill.com/chapters/' + chs[0].id);
      const pHtml = await pRes.text();
      const pRegex = /<picture[^>]*>\s*<img[^>]+data-src="([^"]+)"/gi;
      let pMatch;
      let pgs = [];
      while ((pMatch = pRegex.exec(pHtml)) !== null) {
        pgs.push(pMatch[1]);
      }
      if(pgs.length === 0) {
         const pRegex2 = /<picture[^>]*>\s*<img[^>]+src="([^"]+)"/gi;
         while ((pMatch = pRegex2.exec(pHtml)) !== null) {
            pgs.push(pMatch[1]);
         }
      }
      console.log('Pages:', pgs.length);
      console.log('First page:', pgs[0]);
    }
  }
}
test().catch(console.error);
