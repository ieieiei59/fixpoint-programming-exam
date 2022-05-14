import { readFile } from "fs/promises"
import { Log, Logs } from "../models/log"

export const readLogFile = async (logFilePath: string): Promise<Logs> => {
  const rawLogs = await readFile(logFilePath, "utf-8")
  return new Logs(
    ...rawLogs.split("\n").map((rawLog: string) => Log.parse(rawLog))
  )
}
