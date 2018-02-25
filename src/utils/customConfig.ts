import chalk from 'chalk'

const chars = {
  'top': '═',
  'top-mid': '╤',
  'top-left': '╔',
  'top-right': '╗',
  'bottom': '═',
  'bottom-mid': '╧',
  'bottom-left': '╚',
  'bottom-right': '╝',
  'left': '║',
  'left-mid': '╟',
  'mid': '─',
  'mid-mid': '┼',
  'right': '║',
  'right-mid': '╢',
  'middle': '│'
}

export const TABLE_CONF = {
  chars,
  head: ['id', 'Status', 'Notes', 'Alarm'],
  colWidths: [5, 10, 40, 18]
}

export const TODO_STATUS = [chalk.yellow('pending'), chalk.greenBright('done'), chalk.redBright('canceled')]

export const TODO_PPRIOROTY = ['!', '!!', '!!!']

export const ADD_STEP = {
  NOTES: { type: 'input', name: 'notes', message: 'Your task content', validate: val => !!val },
  DATE: { type: 'input', name: 'date', message: 'Date before task complete' },
  PRIORITY: { type: 'input', name: 'priority', message: 'Use ! repersent your task priority' },
  CONFIRM: { type: 'confirm', name: 'yes' }
}

export const DELETE_STEP = {
  TASKID: { type: 'input', name: 'id', message: 'Need a specific task id before delete', validate: val => !!val },
  CONFIRM: { type: 'confirm', name: 'yes' },
  ALL: { type: 'confirm', name: 'yes', message: 'Delete all task from database?' }
}

export const SQL = {
  CREATE: () => 'CREATE TABLE task (id INTEGER PRIMARY KEY AUTOINCREMENT, status int, content char, alarm date, priority int);',
  ADD: (s, c, a, p) => `INSERT INTO task VALUES (null, ${s}, '${c}', '${a}', ${p});`,
  DEL: (id) => `DELETE FROM task WHERE id=${id};`,
  READ: () => 'SELECT * FROM task'
}

export const SIRI = {
  LIST: () => chalk.blue('This is your list 🍻 '),
  SUMMARY: (l, t) => `${chalk.yellowBright(l)} rows total, rendered in ${chalk.blueBright(t)}ms`
}
