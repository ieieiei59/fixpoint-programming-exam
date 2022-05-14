import { Command } from "@oclif/core"
import { logsStrictCommandHandler } from "../../command-handlers/logs/strict"

export default class Strict extends Command {
  static description =
    "一度でもタイムアウトがあれば故障とし、さらに次に応答があるまでの期間を故障期間として、故障対象サーバーアドレスと故障期間を表示する。"

  static examples = [
    [
      "$ ping-logs-cli logs strict <log-file-path>",
      "Address            Period",
      "────────────────── ─────────────────────────────────────────────────────",
      "aaa.bbb.ccc.ddd/ee YYYY年MM月DD日hh時mm分ss秒 ~ YYYY年MM月DD日hh時mm分ss秒",
      "aaa.bbb.ccc.ddd/ee YYYY年MM月DD日hh時mm分ss秒 ~ YYYY年MM月DD日hh時mm分ss秒",
      "aaa.bbb.ccc.fff/gg YYYY年MM月DD日hh時mm分ss秒 ~ YYYY年MM月DD日hh時mm分ss秒",
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

  async run(): Promise<void> {
    type FlagsType = {}
    type ArgsType = { logFilePath: string }

    const { args } = await this.parse<FlagsType, ArgsType>(Strict)

    const { dumpResultData } = await logsStrictCommandHandler({
      logFilePath: args.logFilePath,
    })

    dumpResultData()
  }
}
