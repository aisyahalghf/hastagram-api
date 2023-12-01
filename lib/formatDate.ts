export const formateDate = (input: Date) => {
  const date = new Date(input);
  const option: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", option);

  return formattedDate;
};
