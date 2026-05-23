const fetch = require('node-fetch');
async function test() {
  const q = encodeURIComponent('One Piece');
  const res = await fetch('https://mangapill.com/search?q=' + q);
  const html = await res.text();
  const match = html.match(/<a href="\/manga\/(\d+\/[^"]+)"/);
  if (match) {
    console.log('MangaPill ID:', match[1]);
    const chRes = await fetch('https://mangapill.com/manga/' + match[1]);
    const chHtml = await chRes.text();
    const chMatch = chHtml.match(/<a href="\/chapters\/([^"]+)"[^>]*>Chapter (\d+(\.\d+)?)<\/a>/g);
    console.log('Chapters found:', chMatch?.length);
    console.log('Sample:', chMatch?.slice(0, 3));
  }
}
test().catch(console.error);
