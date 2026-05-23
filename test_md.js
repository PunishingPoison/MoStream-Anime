async function test() {
  const res = await fetch('https://api.mangadex.org/manga?title=Naruto');
  const data = await res.json();
  console.log(JSON.stringify(data.data[0].attributes.links, null, 2));
}
test();
