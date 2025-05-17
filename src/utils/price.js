// utils/price.js
export const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return parseFloat(priceStr.replace('$', '').split('/')[0]);
  };