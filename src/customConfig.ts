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
  head: ['Status', 'Notes', 'Alarm'],
  colWidths: [10, 20, 18]
}

export const TODO_STATUS = ['🤔', '😌', '1']

export const TODO_PPRIOROTY = ['!', '!!', '!!!']

export const ADD_STEP = {
  NOTES: { type: 'input', name: 'notes', message: 'Your task content' },
  DATE: { type: 'input', name: 'date', message: 'Date before task complete' },
  PRIORITY: { type: 'input', name: 'priority', message: 'Use ! repersent your task priority' },
  CONFIRM: { type: 'confirm', name: 'yes' }
}
