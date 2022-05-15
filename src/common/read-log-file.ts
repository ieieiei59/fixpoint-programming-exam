import { readFile } from "fs/promises"
import { Log, Logs } from "../models/log"

/**
 * ファイルパスを受け取り、ログデータを作成する関数
 */
export const readLogFile = async (logFilePath: string): Promise<Logs> => {
  const rawLogs = await readFile(logFilePath, "utf-8")
  return new Logs(
    ...rawLogs
      .split("\n")
      .map((rawLog: string) => {
        try {
          return Log.parse(rawLog)
        } catch (e) {
          return undefined
        }
      })
      .filter((item): item is Log => item !== undefined)
  )
}
