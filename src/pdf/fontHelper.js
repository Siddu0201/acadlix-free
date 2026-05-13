export const getFontFamily = (text) => {
  if (/[\u0900-\u097F]/.test(text)) return "NotoDevanagari"; // Hindi
  if (/[\u0E00-\u0E7F]/.test(text)) return "NotoThai";       // Thai
  if (/[\u0600-\u06FF]/.test(text)) return "NotoArabic";     // Arabic
  if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(text)) return "NotoJP"; // Japanese

  return "NotoLatin"; // default
};