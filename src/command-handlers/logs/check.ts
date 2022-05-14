import { cli } from "cli-ux"
import { Duration, formatDuration } from "date-fns"
import { ja } from "date-fns/locale"
import { readFile } from "fs/promises"
import { Log, Logs } from "../../models/log"

export type LogsCheckCommandHandlerArgsType = {
  logFilePath: string
  thresholdTimeout: number
}

export type LogsCheckCommandHandlerResultType = {
  resultData: {
    address: string
    duration: Duration | undefined
    nthTime: number
  }[]
  dumpResultData: () => void
}

export const logsCheckCommandHandler = async ({
  logFilePath,
  thresholdTimeout,
}: LogsCheckCommandHandlerArgsType): Promise<LogsCheckCommandHandlerResultType> => {
  const rawLogs = await readFile(logFilePath, "utf-8")
  const logs = new Logs(
    ...rawLogs.split("\n").map((rawLog: string) => Log.parse(rawLog))
  )

  const addressLogsMap = logs.groupByAddress()

  const resultData = Array.from(addressLogsMap.keys()).reduce<
    LogsCheckCommandHandlerResultType["resultData"]
  >((results, address) => {
    const logs = addressLogsMap.get(address)

    if (logs === undefined) {
      return results
    }

    const additionalResults = logs
      .filterByFailure({ thresholds: { timeout: thresholdTimeout } })
      .map((timeoutLog: Log) => ({
        timeoutLog,
        nextLog: logs.filterByTimeout(false).findNext(timeoutLog),
      }))
      .map((item, index) => {
        const duration =
          item.nextLog === undefined
            ? undefined
            : Log.getDurationLogs(item.timeoutLog, item.nextLog)

        return { address, duration, nthTime: index + 1 }
      })

    return [...results, ...additionalResults]
  }, [])

  const dumpResultData = () => {
    cli.table(
      resultData.map((item) => ({
        ...item,
        duration:
          item.duration && formatDuration(item.duration, { locale: ja }),
      })),
      {
        address: { header: "Address" },
        duration: { header: "Duration" },
        nthTime: { header: "Nth-time" },
      }
    )
  }

  return { resultData, dumpResultData }
}
