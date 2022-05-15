import {
  logsCheckCommandHandler,
  LogsCheckCommandHandlerArgsType,
  LogsCheckCommandHandlerResultType,
} from "./check"

type LogsStrictCommandHandlerArgsType = Pick<
  LogsCheckCommandHandlerArgsType,
  "logFilePath"
> & {}

type LogsStrictCommandHandlerResultType = LogsCheckCommandHandlerResultType & {}

/**
 * 設問1の処理を実施する関数
 *
 * 具体的な処理は、設問2の処理を実施する関数に移譲している (n=1)
 */
export const logsStrictCommandHandler = async ({
  logFilePath,
}: LogsStrictCommandHandlerArgsType): Promise<LogsStrictCommandHandlerResultType> => {
  return await logsCheckCommandHandler({
    logFilePath,
    thresholdTimeout: 1,
  })
}
