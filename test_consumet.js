const { META } = require('@consumet/extensions');

async function test() {
  const anilistManga = new META.Anilist.Manga();
  try {
    // 105398 is Chainsaw Man on AniList
    const info = await anilistManga.fetchMangaInfo('105398');
    console.log("Chapters found:", info.chapters.length);
    console.log(info.chapters[0]);
  } catch (e) {
    console.error(e);
  }
}
test();
