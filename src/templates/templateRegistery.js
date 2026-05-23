import ClassicLandscape from "./certificates/course/ClassicLandscape";
import ClassicPortrait from "./certificates/course/ClassicPortrait";
import ModernLandscape from "./certificates/course/ModernLandscape";
import ModernPortrait from "./certificates/course/ModernPortrait";

export const templateRegistry = {

  certificates: {
    course: {
      "classic-portrait": ClassicPortrait,
      "classic-landscape": ClassicLandscape,
      "modern-portrait":  ModernPortrait,
      "modern-landscape": ModernLandscape
    },
  },
  quiz: {
    shortcode: {
      "template-1": require("./quiz/shortcode/Template1").default,
      "template-2": require("./quiz/shortcode/Template2").default,
      "template-3": require("./quiz/shortcode/Template3").default
    }
  }
};