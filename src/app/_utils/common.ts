import CryptoJS from "crypto-js";

export const calculateMD5Hash = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
      const hash = CryptoJS.MD5(wordArray).toString();
      resolve(hash);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
};

export const urlPattern = new RegExp(
  "^(https?:\\/\\/)?" + // プロトコル
    "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // ドメイン名
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // IPアドレス
    "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // ポートとパス
    "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // クエリストリング
    "(\\#[-a-zA-Z\\d_]*)?$", // フラグメント
  "i" // 大文字小文字を区別しない
);
