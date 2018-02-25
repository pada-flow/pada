import { printf } from '../utils'
import chalk from 'chalk'
import TaskDB from '../utils/taskDB'
import { SIRI, TABLE_CONF, TODO_STATUS, TODO_PPRIOROTY } from '../utils/customConfig'

const Table = require('cli-table2')
const moment = require('moment')
// const Timeter = require('./../../../node-stopwatch')
const Timeter = require('node-timeter')

const timeter = new Timeter()
timeter.start()

const table = new Table(TABLE_CONF);

const taskDB = new TaskDB()

const tasks: Array<any> = taskDB.read()

const renderId = (index: number) => index

const renderStatus = (index: number) => TODO_STATUS[index]

const renderPriority = (rate: number) => `[${TODO_PPRIOROTY[rate]}]`

const renderNotes = (priority: number, notes: string) => `${renderPriority(priority)}${notes}`

const renderRow = (row) => [
  renderId(row[0]),
  renderStatus(row[1]),
  renderNotes(row[4], row[2]),
  moment(row[3]).format('YYYY/MM/DD HH:ss')
]

tasks.map(row => table.push(renderRow(row)))

const renderSummary = () => SIRI.SUMMARY(table.length, timeter.stop())

printf(SIRI.LIST()),
printf(table.toString()),
printf(renderSummary())
