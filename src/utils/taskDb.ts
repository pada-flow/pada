import chalk from 'chalk'
import { printf } from '../utils'
import Task from './customTyping'

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
    const sqlstr = 'CREATE TABLE task (a int, b char);'
    const data = this.db
      .run(sqlstr)
      .export()
    const buffer = new Buffer(data)

    fs.writeFileSync(PATH_TO_DB, buffer)
    printf(chalk.blue('Database created!'))
  }

  add (task: Task) {
    const { status, content, alarm, priority } = task
    const sqlstr = 'INSERT INTO task VALUES (0, "hello");'
    this.db.run(sqlstr)
  }

  update () {}

  del () {}

  read () {
    // 没有数据库文件时，先创建
    !dbBuffer && this.create()
    const res = this.db.exec("SELECT * FROM task")
    console.log('res--->', res)
  }
}

const tt = new taskDB()
tt.read()
tt.add({
  status: 1,
  content: '123',
  alarm: new Date(),
  priority: 1
})
tt.read()

export default taskDB