import { Bytes } from "firebase/firestore";
import { MINIMUM_BUFFER_LENGTH } from "../constants/constants";
const usx = require("unishox2.siara.cc");

export default function compressText(text: string) {
  const minimumBufferLength = Math.max(MINIMUM_BUFFER_LENGTH, text.length);
  const outBuffer = new Uint8Array(minimumBufferLength); // A buffer with arbitrary length
  const compressedTextLength: number = usx.unishox2_compress_simple(text, text.length, outBuffer);
  const compressedText = Bytes.fromUint8Array(outBuffer.slice(0, compressedTextLength));

  // for checking the compression ration
  // const compressedBuffer = outBuffer.subarray(0, compressedTextLength); // Get the compressed buffer
  // const compressionRatio = (text.length - compressedBuffer.byteLength) / text.length;
  // console.log({compressionRatio});

  return { compressedText, compressedTextLength };
}
