//validation and api server

const express = require('express')
const {scheduleJobs} = require('/scheduler')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())


//input validation - returns error message if invalid

function validateJobs(jobs) {
    if (!Array.isArray(jobs)) {             //checks if jobs are array
        return 'jobs must be an array'
    }

    if (jobs.length === 0){                 //cheks if array is empty
        return 'jobs array cant be empty'
    }
}

