import Svg, { Image } from "react-native-svg";

export default SVGBackground = () => (
  <Svg height="100%" width="100%">
    <Image
      href={require("./path_to_your_svg_file.svg")}
      height="100%"
      width="100%"
    />
  </Svg>
);
