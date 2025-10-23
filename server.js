//validation and api server

const express = require('express')
const {scheduleJobs} = require('/scheduler')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())