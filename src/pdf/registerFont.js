import { Font } from "@react-pdf/renderer";

Font.register({
  family: "NotoLatin",
  src: `${acadlixOptions?.pdf_url}fonts/NotoSans-Regular.ttf`,
});

Font.register({
  family: "NotoDevanagari",
  src: `${acadlixOptions?.pdf_url}fonts/NotoSansDevanagari-Regular.ttf`,
});

Font.register({
  family: "NotoThai",
  src: `${acadlixOptions?.pdf_url}fonts/NotoSansThai-Regular.ttf`,
});

Font.register({
  family: "NotoArabic",
  src: `${acadlixOptions?.pdf_url}fonts/NotoSansArabic-Regular.ttf`,
});

Font.register({
  family: "NotoJP",
  src: `${acadlixOptions?.pdf_url}fonts/NotoSansJP-Regular.ttf`,
});