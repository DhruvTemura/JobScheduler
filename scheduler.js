// main scheduling logic

function scheduleJobs(jobs) {

    const executed = new Set() //tracks executed jobs

    const executionOrder = []  //stores execution order (job ids)

    const schedule = []        //stores detailed schedule (job info + execution time)

    let currentTime = 0        //setting start time as 0

    //keeps going until all jobs are executed
    while (executed.size < jobs.length) {

        //1) find jobs that have arrived, but not been executed yet
        const availableJobs = jobs.filter (job => 
            job.arrivalTime <= currentTime && !executed.has(job.job_id)
        )

        //2) if no jobs available, skip to next arrival time
        if (availableJobs.length === 0) {
            const nextArrival = Math.min(      //find next job that will arrive
                ...jobs
                  .filter(job => !executed.has(job.job_id))
                  .map(job => job.arrival_time)
            )
            currentTime = nextArrival
            continue;                       //going back to while loop
        }

        //3) sort available jobs by priority and job_Id
        availableJobs.sort((a,b) => {

            //higher priority goes first
            if (b.priority !== a.priority) {
                return b.priority - a.priority
            }

            //if same priority, lower job_Id goes first
            return a.job_id - b.job_id
        })

        //4) pick the 1st job after sorting/
        const jobToExecute = availableJobs[0]

        //5) execute it
        executed.add(jobToExecute.job_id)
        executionOrder.push(jobToExecute.job_id)


        //add to detailed schedule
        schedule.push({
            job_id: jobToExecute.job_id,
            priority: jobToExecute.priority,
            arrival_time: jobToExecute.arrival_time,
            executed_at: currentTime
        })

        //6) move time forward (each job take 1 time unit)
        currentTime++
    }

    return {
        execution_order: executionOrder,
        schedule: schedule,
        total_time: currentTime 
    }
}

module.exports = {scheduleJobs}
