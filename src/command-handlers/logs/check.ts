import { cli } from "cli-ux"
import { readLogFile } from "../../common/read-log-file"
import { Log } from "../../models/log"
import { Period } from "../../models/period"

export type LogsCheckCommandHandlerArgsType = {
  logFilePath: string
  thresholdTimeout: number
}

export type LogsCheckCommandHandlerResultType = {
  resultData: {
    address: string
    period: Period
  }[]
  dumpResultData: () => void
}

export const logsCheckCommandHandler = async ({
  logFilePath,
  thresholdTimeout,
}: LogsCheckCommandHandlerArgsType): Promise<LogsCheckCommandHandlerResultType> => {
  const logs = await readLogFile(logFilePath)

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
      .map((item) => {
        const period = new Period(
          item.timeoutLog.timestamp,
          item.nextLog?.timestamp ?? null
        )

        return { address, period }
      })

    return [...results, ...additionalResults]
  }, [])

  const dumpResultData = () => {
    cli.table(
      resultData.map((item) => ({
        ...item,
        period: item.period.toString(),
      })),
      {
        address: { header: "Address" },
        period: { header: "Period" },
      }
    )
  }

  return { resultData, dumpResultData }
}
