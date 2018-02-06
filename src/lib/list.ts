const chalk = require('chalk')
const Table = require('cli-table2')
const moment = require('moment')
// const Timeter = require('./../../../node-stopwatch')
const Timeter = require('node-timeter')
const { tableConf, todoStatus, todoPriority } = require('./../customConfig')
const { printf } = require('./../utils')

const timeter = new Timeter()
timeter.start()

const table = new Table(tableConf);

const store = [
  {
    status: 0,
    priority: 0,
    notes: 'notesss',
    time: new Date()
  },
  {
    status: 0,
    priority: 0,
    notes: 'notesss',
    time: new Date()
  }
]

const renderStatus = (index: number) => todoStatus[index]

const renderPriority = (rate: number) => `[${todoPriority[rate]}]`

const renderNotes = (priority: number, notes: string) => `${renderPriority(priority)}${notes}`

const renderRow = (row) => [
  renderStatus(row.status),
  renderNotes(row.priority, row.notes),
  moment(row.time).format('YYYY/MM/DD HH:ss')
]

store.map(row => table.push(renderRow(row)))

const renderSummary = () => `${table.length} rows total, rendered in ${timeter.stop()}ms`

const list = () => {
  return (
    printf(chalk.blue('This is your list 🍻 ')),
    printf(table.toString()),
    printf(renderSummary())
  )
}

module.exports = list
// export default list
module.exports.default = list