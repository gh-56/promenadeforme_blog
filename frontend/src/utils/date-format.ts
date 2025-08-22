export const formattedDate = (originalDate: string) => {
  const date = new Date(originalDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}/${month}/${day}`;
};
