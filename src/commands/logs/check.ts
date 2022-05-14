import { Command, Flags } from "@oclif/core"
import { logsCheckCommandHandler } from "../../command-handlers/logs/check"

export default class Check extends Command {
  static description =
    "N回タイムアウトがあれば故障とし、さらに次に応答があるまでの期間を故障期間として、故障対象サーバーアドレスと故障期間を表示する。"

  static examples = [
    [
      "$ ping-logs-cli logs check <log-file-path>",
      "Address            Duration      Nth-time",
      "────────────────── ───────────── ────────",
      "aaa.bbb.ccc.ddd/ee hh時間mm分ss秒 1",
      "aaa.bbb.ccc.ddd/ee hh時間mm分ss秒 2",
      "aaa.bbb.ccc.fff/gg hh時間mm分ss秒 1",
    ].join("\n"),
  ]

  static flags = {
    n: Flags.integer({ char: "n", default: 1 }),
  }

  static args = [
    {
      name: "logFilePath",
      description: "pingログのファイルパス",
      required: true,
    },
  ]

  async run(): Promise<void> {
    type FlagsType = { n: number }
    type ArgsType = { logFilePath: string }

    const { args, flags } = await this.parse<FlagsType, ArgsType>(Check)

    const { dumpResultData } = await logsCheckCommandHandler({
      logFilePath: args.logFilePath,
      thresholdTimeout: flags.n,
    })

    dumpResultData()
  }
}
