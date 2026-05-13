import { Text } from "@react-pdf/renderer";
import { getFontFamily } from "./fontHelper";

const PdfText = ({ children, style = {}, ...props }) => {
  return (
    <Text
      {...props}
      style={{
        fontFamily: getFontFamily(children),
        ...style,
      }}
    >
      {children}
    </Text>
  );
};

export default PdfText;