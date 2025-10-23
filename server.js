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

    const jobIds = new Set()                //checking for duplicates

    for (let i = 0; i<jobs.length; i++){
        const job = jobs[i]

        //checking if all fields are present
        if(!job.hasOwnProperty('job_Id')) {
            return `job at index ${i} is missing job_Id`
        }
        if(!job.hasOwnProperty('priority')) {
            return `Job at index ${i} is missing priority`;
        }   
        if(!job.hasOwnProperty('arrival_time')) {
            return `Job at index ${i} is missing arrival_time`;
        }

        //checking if job_Id is valid no.
        if(typeof job.job_Id !== 'number' || !Number.isInteger(job.job_Id)){
            return  `job ${job.job_Id}: job_Id must be an integer`
        }

        //checking for duplicate job_ids
        if(jobIds.has(job.job_Id)){
            return `duplicate job_Id found: ${job.job_Id}`
        }
        jobIds.add(job.job_Id)
    }
}

