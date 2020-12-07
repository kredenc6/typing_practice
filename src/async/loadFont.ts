import WebFont, { Config } from "webfontloader";

export default function loadFont(config: Config) {
  WebFont.load(config);
}
