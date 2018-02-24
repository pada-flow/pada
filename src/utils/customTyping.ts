import chalk from 'chalk'

interface TaskOption {
  status: number
  content: string
  alarm: Date
  priority: number
}

class Task {
  readonly status: number
  readonly content: string
  readonly alarm: Date
  readonly priority: number

  constructor (option: TaskOption) {
    this.status = option.status
    this.content = option.content
    this.alarm = option.alarm
    this.priority = option.priority
  }
}

const SQL = {
  CREATE: () => 'CREATE TABLE task (id INTEGER PRIMARY KEY AUTOINCREMENT, status int, content char, alarm date, priority int);',
  ADD: (s, c, a, p) => `INSERT INTO task VALUES (null, ${s}, '${c}', '${a}', ${p});`,
  DEL: (id) => `DELETE FROM task WHERE id=${id};`,
  READ: () => 'SELECT * FROM task'
}

const SIRI = {
  LIST: () => chalk.blue('This is your list 🍻 '),
  SUMMARY: (l, t) => `${chalk.yellowBright(l)} rows total, rendered in ${chalk.blueBright(t)}ms`
}

export {
  Task,
  SQL,
  SIRI
}