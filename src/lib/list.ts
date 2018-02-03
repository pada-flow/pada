const chalk = require('chalk')
const Table = require('cli-table2')
const moment = require('moment')

const printf = console.log
const table = new Table({
  head: ['Status', 'Notes', 'Alarm']
, colWidths: [10, 20, 30]
});

const store = [
  {
    status: 0,
    priority: 0,
    notes: 'notesss',
    time: new Date()
  }
]

const renderStatus = (index: number) => {
  return ['🤔', '😌'][index]
}

const renderPriority = (rate: number) => {
  let priority: string = ''
  switch (rate) {
    case 0:
      priority = '!'
    case 1:
      priority = '!!'
    case 2:
      priority = '!!!'
  }
  return `[${priority}]`
}

const renderNotes = (priority: number, notes: string) => `${renderPriority(priority)}${notes}`

const renderRow = (row) => {
  return [
    renderStatus(row.status),
    renderNotes(row.priority, row.notes),
    moment(row.time).format('YYYY/MM/DD HH:ss')
  ]
}

store.map(row => table.push(renderRow(row)))

const renderSummary = () => {
  return `${table.length} rows total, rendered in`
}

const list = () => {
  return (
    printf(chalk.blue('This is your list 🍻 ')),
    printf(table.toString()),
    printf(renderSummary())
  )
}

module.exports = list