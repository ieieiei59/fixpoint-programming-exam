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

/**
 * 設問2の処理を実施する関数
 *
 * 処理としては、以下の流れ
 * 1. ログデータをアドレスでグルーピング
 * 2. グルーピングしたデータを日付順に並べ、故障条件を満たすログ郡の先頭を取得
 * 3. 2で取得した故障ログをもとに、復旧した際のログを取得する
 * 4. 2, 3の情報を利用して結果・表示用関数を作成し、返却する
 */
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
