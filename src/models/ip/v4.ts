export class IPv4 {
  public readonly firstOctet: number
  public readonly secondOctet: number
  public readonly thirdOctet: number
  public readonly forthOctet: number
  public readonly prefixLength: number

  constructor(ipv4Text: string) {
    const [withoutPrefix, prefixLength] = ipv4Text.split("/")
    const splitted = withoutPrefix.split(".")

    this.firstOctet = parseInt(splitted[0])
    this.secondOctet = parseInt(splitted[1])
    this.thirdOctet = parseInt(splitted[2])
    this.forthOctet = parseInt(splitted[3])
    this.prefixLength = parseInt(prefixLength)
  }

  toString(): string {
    return `${this.firstOctet}.${this.secondOctet}.${this.thirdOctet}.${this.forthOctet}/${this.prefixLength}`
  }

  equals(target: IPv4): boolean {
    return this.toString() === target.toString()
  }
}
