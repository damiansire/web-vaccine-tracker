export const sortDateAsc = (a, b) => {
  let dateA = new Date(a.date).getTime();
  let dateB = new Date(b.date).getTime();
  return dateA > dateB ? 1 : -1;
};
