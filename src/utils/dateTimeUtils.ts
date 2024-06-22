/**
 * ISO 8601形式の日付文字列を日本の日付形式に変換する関数
 * @param {string} iso8601date - ISO8601形式の文字列 例："2023-09-10T09:00:00.000Z"
 * @returns {string} - 日本で一般的に使われる形式の文字列 例："2023/09/10 09:00"
 */
export const formatIso8601ToJpDateTime = (iso8601date: string): string => {
  return new Date(iso8601date).toLocaleDateString("ja-JP", {
    year: "numeric", // 2桁表示の「西暦」
    month: "2-digit", // 2桁表示の「月」zero padding
    day: "2-digit", // 2桁表示の「日」
    // hour: "2-digit",   // 2桁表示の「時」(24H表示)
    // minute: "2-digit", // 2桁表示の「分」
  });
};
