"use strict"

const mysql = require("mysql")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")

// user
const Users = require("./Routes/Users")

const app = express()

app.use(cors({ origin: "*" }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// config data
// const DB_NAME = require("./config/data").DB_NAME
// const HOST = require("./config/data").HOST
// const DB_SECRET = require("./config/data").DB_SECRET
// const USER_NAME = require("./config/data").USER_NAME

//end of

// Connect To DB
const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Shubham@4114",
	database: "Github-Db",
})

con.connect(function (err) {
	if (err) throw err
	console.log("connected!", err)
})

con.on("error", () => console.log("err"))

var del = con._protocol._delegateError
con._protocol._delegateError = function (err, sequence) {
	if (err.fatal) {
		console.trace("fatal error: " + err.message)
	}
	return del.call(this, err, sequence)
}

// this func allow users to visit this path
app.use("/images", express.static(path.join(__dirname, "images")))
app.use(express.static(path.join(__dirname, "react")))

app.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "react", "index.html"))
})

// api
app.use("/api/users", Users)

// port

const port = process.env.PORT || 4000

// run the server
app.listen(port, () => console.log(` app listen on port ${port}`))
