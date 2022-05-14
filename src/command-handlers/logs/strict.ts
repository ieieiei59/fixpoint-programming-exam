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

export const logsStrictCommandHandler = async ({
  logFilePath,
}: LogsStrictCommandHandlerArgsType): Promise<LogsStrictCommandHandlerResultType> => {
  return await logsCheckCommandHandler({
    logFilePath,
    thresholdTimeout: 1,
  })
}
