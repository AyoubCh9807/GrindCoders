export const getCompanies = (companies: string) => {
  if(!companies) return [];
  return companies.split(",").map((c) => c.toLowerCase().trim());
}