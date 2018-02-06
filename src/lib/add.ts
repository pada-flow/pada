const fs = require('fs')
const { Task } = require('./../customTyping')

const add = () => {
  const detail = {
    status: 12,
    content: 12,
    alarm: 12,
    priority: 12
  }
  const task = new Task(detail)
  console.dir(task)
}

module.exports = add

module.exports.default = add