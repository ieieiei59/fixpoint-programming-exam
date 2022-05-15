import { Command, Flags } from "@oclif/core"
import { logsCheckSubnetCommandHandler } from "../../command-handlers/logs/check-subnet"

export default class CheckSubnet extends Command {
  static description =
    "N回タイムアウトがあれば故障とし、さらに次に応答があるまでの期間を故障期間として、故障対象サブネットと故障期間を表示する。"

  static examples = [
    [
      "$ ping-logs-cli logs check-subnet <log-file-path>",
      "Subnet                            Period",
      "───────────────────────────────── ─────────────────────────────────────────────────────",
      "aaa.bbb.ccc.ddd ~ aaa.bbb.ccc.eee YYYY年MM月DD日hh時mm分ss秒 ~ YYYY年MM月DD日hh時mm分ss秒",
      "aaa.bbb.ccc.ddd ~ aaa.bbb.ccc.eee YYYY年MM月DD日hh時mm分ss秒 ~ YYYY年MM月DD日hh時mm分ss秒",
      "aaa.bbb.ccc.fff ~ aaa.bbb.ccc.ggg YYYY年MM月DD日hh時mm分ss秒 ~ YYYY年MM月DD日hh時mm分ss秒",
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

    const { args, flags } = await this.parse<FlagsType, ArgsType>(CheckSubnet)

    const { dumpResultData } = await logsCheckSubnetCommandHandler({
      logFilePath: args.logFilePath,
      thresholdTimeout: flags.n,
    })

    dumpResultData()
  }
}
