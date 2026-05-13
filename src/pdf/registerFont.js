import { Font } from "@react-pdf/renderer";

Font.register({
  family: "NotoSans",
  fonts: [
    {
      src: `${acadlixOptions?.pdf_url}fonts/NotoSans-Regular.ttf`,
      fontWeight: "normal",
    },
    {
      src: `${acadlixOptions?.pdf_url}fonts/NotoSans-Bold.ttf`,
      fontWeight: "bold",
    },
  ],
});

Font.register({
  family: "NotoSansDevanagari",
  fonts: [
    {
      src: `${acadlixOptions?.pdf_url}fonts/NotoSansDevanagari-Regular.ttf`,
      fontWeight: "normal",
    },
    {
      src: `${acadlixOptions?.pdf_url}fonts/NotoSansDevanagari-Bold.ttf`,
      fontWeight: "bold",
    },
  ],
});