// Detect Devanagari characters
export const isHindi = (text = "") => {
  return /[\u0900-\u097F]/.test(text);
};

export const getFontFamily = (text) => {
  if (isHindi(text)) {
    return "NotoSansDevanagari";
  }

  return "NotoSans";
};