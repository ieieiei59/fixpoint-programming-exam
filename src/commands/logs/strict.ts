import { Command } from "@oclif/core"
import { cli } from "cli-ux"
import { formatDuration, intervalToDuration } from "date-fns"
import { ja } from "date-fns/locale"
import { readFile } from "fs/promises"
import { Log, Logs } from "../../models/log"

export default class Strict extends Command {
  static description =
    "一度でもタイムアウトがあれば故障とし、さらに次に応答があるまでの期間を故障期間として、故障対象サーバーアドレスと故障期間を表示する。"

  static examples = [
    [
      "$ ping-logs-cli logs strict <log-file-path>",
      "Address            Duration      Nth-time",
      "────────────────── ───────────── ────────",
      "aaa.bbb.ccc.ddd/ee hh時間mm分ss秒 1",
      "aaa.bbb.ccc.ddd/ee hh時間mm分ss秒 2",
      "aaa.bbb.ccc.fff/gg hh時間mm分ss秒 1",
    ].join("\n"),
  ]

  static flags = {}

  static args = [
    {
      name: "logFilePath",
      description: "pingログのファイルパス",
      required: true,
    },
  ]

  getDuration(timeoutLog: Log, nextLog: Log): string {
    return formatDuration(
      intervalToDuration({
        start: timeoutLog.timestamp,
        end: nextLog.timestamp,
      }),
      { locale: ja }
    )
  }

  async run(): Promise<void> {
    type ArgsType = { logFilePath: string }

    const { args } = await this.parse<typeof Strict.flags, ArgsType>(Strict)

    const rawLogs = await readFile(args.logFilePath, "utf-8")
    const logs = new Logs(
      ...rawLogs.split("\n").map((rawLog: string) => Log.parse(rawLog))
    )

    const addressLogsMap = logs.groupByAddress()

    const results = Array.from(addressLogsMap.keys()).reduce<
      { Address: string; Duration: string; "Nth-time": number }[]
    >((results, address) => {
      const logs = addressLogsMap.get(address)

      if (logs === undefined) {
        return results
      }

      const additionalResults = logs
        .filterByTimeout()
        .map((timeoutLog: Log) => ({
          timeoutLog,
          nextLog: logs.findNext(timeoutLog),
        }))
        .map((item, index) => {
          const duration =
            item.nextLog === undefined
              ? "未復旧"
              : this.getDuration(item.timeoutLog, item.nextLog)

          return { Address: address, Duration: duration, "Nth-time": index + 1 }
        })

      return [...results, ...additionalResults]
    }, [])

    cli.table(results, { Address: {}, Duration: {}, "Nth-time": {} })
  }
}
