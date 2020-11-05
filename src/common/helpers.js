export const formatNumberWithCommas = (number) => {
  return `₹ ${number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};