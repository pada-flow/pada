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
  head: ['ID', 'TASK', 'STATUS', 'DUE DATE '],
  // colWidths: [5, 10, 40, 22]
}

export const TODO_STATUS = [
  chalk.yellow('·pending'),
  chalk.greenBright('·done'),
  chalk.redBright('·canceled')
]

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

export const LANG_STEP = {
  PICK: { type: 'list', name: 'lang', message: 'Pick a language for your pada', choices: ['English', 'Chinese'] }
}

export const DONE_STEP = {
  CONFIRM: { type: 'confirm', name: 'yes' }
}

export const SQL = {
  CREATE_TABLE_TASK: () => `CREATE TABLE task (id INTEGER PRIMARY KEY AUTOINCREMENT, status int, content char, alarm date, priority int);`,
  CREATE_TABLE_USER: () => `CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, nickname char, email char); INSERT INTO user VALUES (null, '', '')`,
  ADD: (s, c, a, p) => `INSERT INTO task VALUES (null, ${s}, '${c}', '${a}', ${p});`,
  DEL: (id) => `DELETE FROM task WHERE id=${id};`,
  READ: () => 'SELECT * FROM task',
  READ_USER: () => 'SELECT * FROM user',
  UPDATE_USER_NAME: (n) => `UPDATE user set nickname='${n}' WHERE id=1;`,
  UPDATE_USER_MAIL: (e) => `UPDATE user set email='${e}' WHERE id=1;`,
  EXIST: (id) => `SELECT * FROM task WHERE id=${id}`,
  DONE: (id) => `UPDATE task set status=1 WHERE id=${id}`
}

export const SIRI = {
  LIST: () => chalk.blue('This is your list 🍻 '),
  SUMMARY: (l, t) => `${chalk.yellowBright(l)} rows total, rendered in ${chalk.blueBright(t)}ms`
}
