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

  toBinary(): number {
    return (
      (this.firstOctet << 24) +
      (this.secondOctet << 16) +
      (this.thirdOctet << 8) +
      this.forthOctet
    )
  }

  static binaryToString(binary: number): string {
    return [
      binary >>> 24,
      (binary << 8) >>> 24,
      (binary << 16) >>> 24,
      (binary << 24) >>> 24,
    ].join(".")
  }

  toSubnetString(): string {
    const binary = this.toBinary()

    const mask = parseInt("1".repeat(this.prefixLength).padEnd(32, "0"), 2)

    const minBinary = binary & mask
    const maxBinary = binary | ~mask

    return [
      IPv4.binaryToString(minBinary),
      IPv4.binaryToString(maxBinary),
    ].join(" ~ ")
  }

  toSubnet(): IPv4AsSubnet {
    return new IPv4AsSubnet(this.toString())
  }

  equals(target: IPv4): boolean {
    return this.toString() === target.toString()
  }
}

export class IPv4AsSubnet extends IPv4 {
  toString() {
    return this.toSubnetString()
  }
}
