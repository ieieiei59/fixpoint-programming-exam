import { cli } from "cli-ux"
import { readLogFile } from "../../common/read-log-file"
import { Logs } from "../../models/log"
import { Period } from "../../models/period"

type LogsHighLoadCommandHandlerArgsType = {
  logFilePath: string
  thresholdTime: number
  thresholdExceeded: number
}

type LogsHighLoadCommandHandlerResultsType = {
  resultData: Logs[]
  dumpResultData: () => void
}

export const logsHighLoadCommandHandler = async ({
  logFilePath,
  thresholdTime,
  thresholdExceeded,
}: LogsHighLoadCommandHandlerArgsType): Promise<LogsHighLoadCommandHandlerResultsType> => {
  const logs = await readLogFile(logFilePath)

  const resultData = Array.from(logs.groupByAddress().values()).reduce<Logs[]>(
    (result, logs) => {
      const highLoadLogs = logs
        .sortByTimestamp()
        .reduce((highLoadLogs, log) => {
          if (log.time !== null && log.time < thresholdTime) {
            if (highLoadLogs.length >= thresholdExceeded) {
              result.push(new Logs(...highLoadLogs, log))
            }

            return new Logs()
          }

          highLoadLogs.push(log)

          return highLoadLogs
        }, new Logs())

      if (highLoadLogs.length >= thresholdExceeded) {
        result.push(highLoadLogs)
      }

      return result
    },
    []
  )

  const dumpResultData = () => {
    const resultDataForDump = resultData.map((logs) => {
      const lastLog = logs[logs.length - 1]

      return {
        address: logs[0].address.toString(),
        period: new Period(
          logs[0].timestamp,
          lastLog.time === null || lastLog.time < thresholdTime
            ? lastLog.timestamp
            : null
        ).toString(),
      }
    })

    cli.table(resultDataForDump, {
      address: { header: "Address" },
      period: { header: "Period" },
    })
  }

  return { resultData, dumpResultData }
}
