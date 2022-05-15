import { format } from "date-fns"

const formatDateTime = (date: Date | null): string => {
  if (date === null) {
    return ""
  }

  return format(date, "yyyy年MM月dd日HH時mm分ss秒")
}

/**
 * 期間データモデル
 */
export class Period {
  constructor(
    public readonly from: Date | null,
    public readonly to: Date | null
  ) {}

  toString(): string {
    return `${formatDateTime(this.from) || "現在まで"} ~ ${
      formatDateTime(this.to) || "現在"
    }`.trim()
  }
}
