export const getRelatedWords = async (word: string) => {
  const words = word
    .replace(/[-_]/gm, ' ')
    .replace(/\s+/gm, '+');
  const url = `https://api.datamuse.com/words?ml=${words}`;
  const response = await fetch(url);
  const results = await response.json() as { word: string }[];
  return results.map(({ word }) => word);
};
