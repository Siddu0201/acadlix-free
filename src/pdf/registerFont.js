import { Font } from "@react-pdf/renderer";

Font.register({
  family: "AcadlixUniversal",
  fonts: [
    {
      src: `${acadlixOptions?.pdf_url}fonts/NotoSans-Regular.ttf`,
      fontWeight: "normal",
    },
    {
      src: `${acadlixOptions?.pdf_url}fonts/NotoSans-Bold.ttf`,
      fontWeight: "bold",
    },
    {
      src: `${acadlixOptions?.pdf_url}fonts/NotoSansDevanagari-Regular.ttf`,
    },
    {
      src: `${acadlixOptions?.pdf_url}fonts/NotoSansThai-Regular.ttf`,
    },
    {
      src: `${acadlixOptions?.pdf_url}fonts/NotoSansArabic-Regular.ttf`,
    },
    {
      src: `${acadlixOptions?.pdf_url}fonts/NotoSansJP-Regular.ttf`,
    },
  ],
});

// Font.register({
//   family: "NotoSansDevanagari",
//   fonts: [
//     {
//       fontWeight: "normal",
//     },
//     {
//       src: `${acadlixOptions?.pdf_url}fonts/NotoSansDevanagari-Bold.ttf`,
//       fontWeight: "bold",
//     },
//   ],
// });