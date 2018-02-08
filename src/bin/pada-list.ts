import { printf } from '../utils'
import chalk from 'chalk'
const Table = require('cli-table2')
const moment = require('moment')
// const Timeter = require('./../../../node-stopwatch')
const Timeter = require('node-timeter')
const { tableConf, TODO_STATUS, TODO_PPRIOROTY } = require('./../customConfig')

const timeter = new Timeter()
timeter.start()

console.log('printf-->', printf)

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

const renderStatus = (index: number) => TODO_STATUS[index]

const renderPriority = (rate: number) => `[${TODO_PPRIOROTY[rate]}]`

const renderNotes = (priority: number, notes: string) => `${renderPriority(priority)}${notes}`

const renderRow = (row) => [
  renderStatus(row.status),
  renderNotes(row.priority, row.notes),
  moment(row.time).format('YYYY/MM/DD HH:ss')
]

store.map(row => table.push(renderRow(row)))

const renderSummary = () => `${table.length} rows total, rendered in ${timeter.stop()}ms`

printf(chalk.blue('This is your list 🍻 ')),
printf(table.toString()),
printf(renderSummary())
