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
};