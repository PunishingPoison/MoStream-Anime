const fetch = require('node-fetch');

async function test() {
  try {
    const title = 'Naruto';
    const res = await fetch(`http://localhost:3010/api/manga/info?id=${encodeURIComponent(title)}&isTitle=true`);
    const info = await res.json();
    console.log(JSON.stringify(info.chapters.slice(0, 3), null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
