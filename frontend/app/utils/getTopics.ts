export const getTopics = (topics: string) => {
  if(!topics) return [];
  return topics.split(",").map((c) => c.toLowerCase().trim());
}