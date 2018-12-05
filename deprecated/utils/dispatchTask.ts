import { printf } from '../utils'

const fs = require('fs')
const path = require('path')

const read = () => {
}

function dispatchTask (task) {
  read()
  printf('dispatchTask--->', task)
}

module.exports = dispatchTask
// exports.default = dispatchTask
