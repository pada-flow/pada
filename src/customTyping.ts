export class Task {
  readonly status: number
  readonly content: string
  readonly alarm: Date
  readonly priority: number

  constructor (option: Task) {
    this.status = option.status
    this.content = option.content
    this.alarm = option.alarm
    this.priority = option.priority
  }
}
