import chalk from 'chalk'
import { printf } from '../utils'
import { Task } from './customTyping'
import { SQL } from './customConfig'

const fs = require('fs')
const path = require('path')
const sql = require('sql.js')

const PATH_TO_DB = path.resolve(__dirname, '../../db/pada.db')

const dbBuffer = fs.existsSync(PATH_TO_DB)
  ? fs.readFileSync(PATH_TO_DB)
  : null

class taskDB {
  private db: any = new sql.Database(dbBuffer)

  constructor () {
  }

  create () {
    const data = this.db
      .run(SQL.CREATE())
      .export()
    const buffer = new Buffer(data)

    fs.writeFileSync(PATH_TO_DB, buffer)
    printf(chalk.blue('Database created!'))
  }

  add (task: Task) {
    const { status, content, alarm, priority } = task
    const sqlstr = SQL.ADD(status, content, alarm, priority)
    this.db.run(sqlstr)
    this.close()
  }

  update () {}

  del (id: number) {
    printf(`deleting task id ${id}...`)
    const sqlstr = SQL.DEL(id)
    this.db.run(sqlstr)
    this.close()
  }

  delAll () {
    printf(`deleting all task...`)
  }

  read () {
    // 没有数据库文件时，先创建
    !dbBuffer && this.create()
    const res = this.db.exec(SQL.READ())[0]
    const val = res ? res.values : []
    return val
  }
  close () {
    const data = this.db.export()
    const buffer = new Buffer(data)
    fs.writeFileSync(PATH_TO_DB, buffer)
  }
}

export default taskDB