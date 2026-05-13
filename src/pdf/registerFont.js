import { Font } from "@react-pdf/renderer";

Font.register({
  family: "NotoSans",
  fonts: [
    {
      src: "./fonts/NotoSans-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "./fonts/NotoSans-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

Font.register({
  family: "NotoSansDevanagari",
  fonts: [
    {
      src: "./fonts/NotoSansDevanagari-Regular.ttf",
      fontWeight: "normal",
    },
    {
      src: "./fonts/NotoSansDevanagari-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});