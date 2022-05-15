import { cli } from "cli-ux"
import { readLogFile } from "../../common/read-log-file"
import { Log, Logs } from "../../models/log"
import { Period } from "../../models/period"
import { LogsCheckCommandHandlerArgsType } from "./check"

export type LogsCheckSubnetCommandHandlerArgsType =
  LogsCheckCommandHandlerArgsType

export type LogsCheckSubnetCommandHandlerResultType = {
  resultData: { subnet: string; period: Period }[]
  dumpResultData: () => void
}

/**
 * 設問4の処理を実施する関数
 *
 * 処理はほぼ設問2と同じ
 * 違いがある部分は以下の通り
 * - ログデータのアドレス部分を別クラスに置き換え IPv4 -> IPv4Subnet
 * - 結果データのキーを変更
 * - 表示用関数のキー・ヘッダを変更
 */
export const logsCheckSubnetCommandHandler = async ({
  logFilePath,
  thresholdTimeout,
}: LogsCheckSubnetCommandHandlerArgsType): Promise<LogsCheckSubnetCommandHandlerResultType> => {
  const logs = await readLogFile(logFilePath)

  const subnetLogsMap = new Logs(
    ...logs.map(
      (item) => new Log(item.timestamp, item.address.toSubnet(), item.time)
    )
  ).groupByAddress()

  const resultData = Array.from(subnetLogsMap.keys()).reduce<
    LogsCheckSubnetCommandHandlerResultType["resultData"]
  >((results, subnet) => {
    const logs = new Logs(
      ...Array.from(
        subnetLogsMap.get(subnet)?.groupByTimestamp().values() ?? []
      ).map((logs) => {
        if (logs.every((log) => log.isTimeout)) {
          return logs[0]
        }

        return logs.filter((log) => !log.isTimeout)[0]
      })
    )

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

        return { subnet, period }
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
        subnet: { header: "Subnet" },
        period: { header: "Period" },
      }
    )
  }

  return { resultData, dumpResultData }
}
