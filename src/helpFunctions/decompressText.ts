import { Bytes } from "firebase/firestore";
const usx = require("unishox2.siara.cc");

export default function decompressText(compressedText: Bytes, compressTextLength: number) {
  const textUint8Array = compressedText.toUint8Array();
  const decompressedString = usx.unishox2_decompress_simple(textUint8Array, compressTextLength) as string;

  return decompressedString;
}
