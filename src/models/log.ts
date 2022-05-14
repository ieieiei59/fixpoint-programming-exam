import { parse } from "date-fns"
import { IPv4 } from "./ip"

export class Log {
  constructor(
    public readonly timestamp: Date,
    public readonly address: IPv4,
    public readonly time: number | null
  ) {}

  static parse(rawLogText: string): Log {
    const [timestampText, ipv4Text, timeText] = rawLogText.split(",")

    const time = parseInt(timeText)

    return new Log(
      parse(timestampText, "yyyyMMddHHmmss", new Date()),
      new IPv4(ipv4Text),
      isNaN(time) ? null : time
    )
  }

  isSameAddress(target: Log): boolean {
    return this.address.equals(target.address)
  }
}

export class Logs extends Array<Log> {
  groupByAddress(): Map<string, Logs> {
    return this.reduce(
      (map, log) =>
        map.set(
          log.address.toString(),
          new Logs(...(map.get(log.address.toString()) ?? []), log)
        ),
      new Map<string, Logs>()
    )
  }

  findNext(log: Log): Log | undefined {
    const sameAddressLogs = this.groupByAddress().get(log.address.toString())

    return sameAddressLogs
      ?.sortByTimestamp()
      .find((sameAddressLog) => sameAddressLog.timestamp > log.timestamp)
  }

  sortByTimestamp(direction: "asc" | "desc" = "asc"): Logs {
    const directionNumber = direction === "asc" ? -1 : 1

    return this.sort((left, right) =>
      left.timestamp < right.timestamp ? directionNumber : directionNumber * -1
    )
  }

  filterByTimeout(): Logs {
    return new Logs(...this.filter((log: Log) => log.time === null))
  }

  static get [Symbol.species](): ArrayConstructor {
    return Array
  }
}
