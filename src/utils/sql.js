const fs = require('fs')
const path = require('path')
const sql = require('sql.js')

const PATH_TO_DB = path.resolve(__dirname, '../../db/pada.db')
const dbBuffer = fs.readFileSync(PATH_TO_DB)

const db = new sql.Database(dbBuffer)

// let sqlstr = "CREATE TABLE hello (a int, b char);"
// sqlstr += "INSERT INTO hello VALUES (0, 'hello');"
// sqlstr += "INSERT INTO hello VALUES (1, 'world');"
// db.run(sqlstr)

var res = db.exec("SELECT * FROM hello")
console.log('res--->', res)
/*
[
	{columns:['a','b'], values:[[0,'hello'],[1,'world']]}
]
*/

// Prepare an sql statement
var stmt = db.prepare("SELECT * FROM hello WHERE a=:aval AND b=:bval");

// Bind values to the parameters and fetch the results of the query
var result = stmt.getAsObject({':aval' : 1, ':bval' : 'world'});
console.log('result--->', result); // Will print {a:1, b:'world'}

const data = db.export()
const buffer = new Buffer(data)
fs.writeFileSync(PATH_TO_DB)