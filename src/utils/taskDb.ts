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

// user table structure: [id, nickname, email]
// task table structure: [id, status, content, alarm, priority]
class taskDB {
  private db: any = new sql.Database(dbBuffer)

  constructor () {
  }

  create () {
    const data = this.db
      .run(SQL.CREATE_TABLE_TASK())
      .run(SQL.CREATE_TABLE_USER())
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

  done (id: number) {
    const sqlstrTask = SQL.EXIST(id)
    const sqlstrDone = SQL.DONE(id)   
    const task = this.db.exec(sqlstrTask)[0]
    if (!task.values) {
      printf(`Task ${id} does not exist`)
      process.exit(1)
    }
    this.db.run(sqlstrDone)
    this.close()
  }

  updateUser (user) {
    !dbBuffer && this.create()
    const { nickname, email } = user
    console.log(user, 'nickname->', nickname, 'email-->', email)
    nickname && this.db.exec(SQL.UPDATE_USER_NAME(nickname))
    email && this.db.exec(SQL.UPDATE_USER_MAIL(email))
    this.close()
  }

  del (id: number) {
    printf(`deleting task id ${id}...`)
    const sqlstr = SQL.DEL(id)
    this.db.run(sqlstr)
    this.close()
  }

  delAll () {
    const taskList = this.read()
    printf(`start deleting all tasks...`)
    taskList.map(t => t && this.del(t[0]))
  }

  read () {
    // 没有数据库文件时，先创建
    !dbBuffer && this.create()
    const res = this.db.exec(SQL.READ())[0]
    const val = res ? res.values : []
    return val
  }

  readUser () {
    !dbBuffer && this.create()
    const res = this.db.exec(SQL.READ_USER())[0]
    const val = res ? res.values[0] : []
    return val
  }

  close () {
    const data = this.db.export()
    const buffer = new Buffer(data)
    fs.writeFileSync(PATH_TO_DB, buffer)
  }
}

export default taskDB