import { Command, Flags } from "@oclif/core"
import { logsHighLoadCommandHandler } from "../../command-handlers/logs/high-load"

/**
 * 設問3に対応するコマンドクラス
 */
export default class HighLoad extends Command {
  static description =
    "応答時間がtミリ秒以上となるログがm回以上続いた場合は高負荷状態とし、対象サーバーアドレスと高負荷期間を表示する。"

  static examples = [
    [
      "$ ping-logs-cli logs check <log-file-path>",
      "Address            Period",
      "────────────────── ─────────────────────────────────────────────────────",
      "aaa.bbb.ccc.ddd/ee YYYY年MM月DD日hh時mm分ss秒 ~ YYYY年MM月DD日hh時mm分ss秒",
      "aaa.bbb.ccc.ddd/ee YYYY年MM月DD日hh時mm分ss秒 ~ YYYY年MM月DD日hh時mm分ss秒",
      "aaa.bbb.ccc.fff/gg YYYY年MM月DD日hh時mm分ss秒 ~ YYYY年MM月DD日hh時mm分ss秒",
    ].join("\n"),
  ]

  static flags = {
    t: Flags.integer({ char: "t", default: 100 }),
    m: Flags.integer({ char: "m", default: 1 }),
  }

  static args = [
    {
      name: "logFilePath",
      description: "pingログのファイルパス",
      required: true,
    },
  ]

  async run(): Promise<void> {
    type FlagsType = { t: number; m: number }
    type ArgsType = { logFilePath: string }

    const { args, flags } = await this.parse<FlagsType, ArgsType>(HighLoad)

    const { dumpResultData } = await logsHighLoadCommandHandler({
      logFilePath: args.logFilePath,
      thresholdTime: flags.t,
      thresholdExceeded: flags.m,
    })

    dumpResultData()
  }
}
