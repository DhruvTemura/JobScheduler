//validation and api server

const express = require('express')
const {scheduleJobs} = require('./scheduler')

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

    const jobIds = new Set()                //checking for duplicates

    for (let i = 0; i<jobs.length; i++){
        const job = jobs[i]

        //checking if all fields are present
        if(!job.hasOwnProperty('job_id')) {
            return `job at index ${i} is missing job_Id`
        }
        if(!job.hasOwnProperty('priority')) {
            return `Job at index ${i} is missing priority`;
        }   
        if(!job.hasOwnProperty('arrival_time')) {
            return `Job at index ${i} is missing arrival_time`;
        }

        //checking if job_Id is valid no.
        if(typeof job.job_id !== 'number' || !Number.isInteger(job.job_id)){
            return  `job ${job.job_Id}: job_Id must be an integer`
        }

        //checking for duplicate job_ids
        if(jobIds.has(job.job_id)){
            return `duplicate job_Id found: ${job.job_id}`
        }
        jobIds.add(job.job_id)

        //checking priority is a valid no.
        if (typeof job.priority !== 'number' || !Number.isInteger(job.priority)){
            return `job ${job.job_id}: priority must be an integer`
        }

        //checking arrivalTime is non -ve
        if(job.priority < 0){
            return `job ${job.job_id}: priority must be non-negative`
        }

        //checking arrivalTime is a valid no.
        if (typeof job.arrivalTime !== 'number' || !Number.isInteger(job.arrival_Time)){
            return `job ${job.job_id}: arrivalTime must be an integer`
        }

        //checking arrivalTime is non -ve
        if(job.arrival_Time < 0){
            return `job ${job.job_id}: arrivalTime must be non-negative`
        }
    }

    return null;
}


//POST /schedule - api route for application

app.post('/schedule', (req,res) => {
    const {jobs} = req.body

    //validate input
    const validationError = validateJobs(jobs)
    if(validationError){
        return res.status(400).json({
            error: 'validation failed',
            details: validationError
        })
    }

    //scheduling
    try{
        const result = scheduleJobs(jobs)

        //send response
        res.json({
            execution_order: result.execution_order,
            schedule: result.schedule,
            total_time: result.total_time
        })
    } catch(error){
        //handling any error
        res.status(500).json({
            error: 'scheduling failed',
            details: error.message
        })
    }
})

//GET /health - basic server check
app.get('/health', (req,res) => {
    res.json({
        status: 'ok - job scheduler',
        timestamp: new Date().toISOString()
    })
})

//server start
app.listen(PORT, () => {
    console.log(`job scheduler running on port ${PORT}`)
})
