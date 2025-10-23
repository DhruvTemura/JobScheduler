# Job Scheduler with Priority Support

A priority-based job scheduler that executes jobs based on priority and arrival time.

## 📋 Overview

This scheduler executes jobs following these rules:
1. **Arrival Time**: Jobs can only execute after their arrival time
2. **Priority**: Among available jobs, pick the highest priority
3. **Tie-breaker**: If same priority, pick the lowest job_id
4. **Time Simulation**: Time moves in discrete steps (1, 2, 3...)

## 🚀 Features

- ✅ Priority-based scheduling
- ✅ Handles arrival times
- ✅ Automatic tie-breaking by job_id
- ✅ Skips empty time slots
- ✅ Input validation
- ✅ Detailed execution schedule
- ✅ REST API

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework

## 📦 Installation
```bash
# Navigate to project folder
cd job-scheduler

# Install dependencies
npm install
```

## 🏃 Running the Application
```bash
# Production mode
npm start

# Development mode (auto-restart)
npm run dev
```

Server starts on **http://localhost:3000**

## 📡 API Endpoints

### 1. Schedule Jobs

**POST** `/schedule`

Submit jobs to be scheduled based on priority.

**Request Body:**
```json
{
  "jobs": [
    { "job_id": 1, "priority": 3, "arrival_time": 2 },
    { "job_id": 2, "priority": 4, "arrival_time": 1 },
    { "job_id": 3, "priority": 4, "arrival_time": 2 }
  ]
}
```

**Response (200 OK):**
```json
{
  "execution_order": [2, 3, 1],
  "schedule": [
    {
      "job_id": 2,
      "priority": 4,
      "arrival_time": 1,
      "executed_at": 1
    },
    {
      "job_id": 3,
      "priority": 4,
      "arrival_time": 2,
      "executed_at": 2
    },
    {
      "job_id": 1,
      "priority": 3,
      "arrival_time": 2,
      "executed_at": 3
    }
  ],
  "total_time": 3
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "jobs": [
      { "job_id": 1, "priority": 3, "arrival_time": 2 },
      { "job_id": 2, "priority": 4, "arrival_time": 1 },
      { "job_id": 3, "priority": 4, "arrival_time": 2 }
    ]
  }'
```

---

### 2. Health Check

**GET** `/health`

Check if server is running.
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-20T12:34:56.789Z"
}
```

---

## ✅ Validation Rules

The API validates all inputs:

### Required Fields
- ✅ `job_id` - Must be present and unique
- ✅ `priority` - Must be present
- ✅ `arrival_time` - Must be present

### Field Types
- ✅ All fields must be integers (whole numbers)
- ✅ `priority` must be >= 0
- ✅ `arrival_time` must be >= 0

### Array Rules
- ✅ Jobs array cannot be empty
- ✅ No duplicate job_ids allowed

### Validation Errors (400 Bad Request)

**Missing field:**
```json
{
  "error": "Validation failed",
  "details": "Job at index 0 is missing priority"
}
```

**Duplicate job_id:**
```json
{
  "error": "Validation failed",
  "details": "Duplicate job_id found: 5"
}
```

**Invalid type:**
```json
{
  "error": "Validation failed",
  "details": "Job 1: priority must be an integer"
}
```

**Negative value:**
```json
{
  "error": "Validation failed",
  "details": "Job 2: arrival_time must be non-negative"
}
```

---

## 🧮 How It Works

### Scheduling Algorithm

**Step-by-Step Process:**

1. **Start at time = 0**

2. **For each time step:**
   - Find all jobs where `arrival_time <= current_time` and not yet executed
   - If no jobs available, skip to next arrival time
   - Sort available jobs by:
     - Priority (highest first)
     - job_id (lowest first if priority is same)
   - Execute the top job
   - Move time forward by 1

3. **Repeat until all jobs executed**

### Example Walkthrough

**Input:**
```javascript
[
  { job_id: 1, priority: 3, arrival_time: 2 },
  { job_id: 2, priority: 4, arrival_time: 1 },
  { job_id: 3, priority: 4, arrival_time: 2 }
]
```

**Execution:**
```
Time 0: No jobs available yet
        → Skip to time 1

Time 1: Job 2 arrives (priority 4)
        Available: [Job 2]
        → Execute Job 2

Time 2: Jobs 1 and 3 arrive
        Available: [Job 1 (priority 3), Job 3 (priority 4)]
        Sort: [Job 3 (priority 4), Job 1 (priority 3)]
        → Execute Job 3 (higher priority)

Time 3: Only Job 1 left
        Available: [Job 1]
        → Execute Job 1

Result: [2, 3, 1]
```

---

## 🎯 Priority Rules

### Rule 1: Higher Priority Wins
```javascript
Job A: priority 5
Job B: priority 3
→ Execute Job A first
```

### Rule 2: Same Priority → Lower job_id Wins
```javascript
Job 5: priority 4
Job 2: priority 4
→ Execute Job 2 first (lower job_id)
```

### Rule 3: Can Only Execute After Arrival
```javascript
Time 2:
Job X: arrival_time 5 (not available yet)
Job Y: arrival_time 1 (available)
→ Can only execute Job Y
```

---

## 🧪 Testing Examples

### Test Case 1: Basic Priority
```bash
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "jobs": [
      { "job_id": 1, "priority": 3, "arrival_time": 2 },
      { "job_id": 2, "priority": 4, "arrival_time": 1 },
      { "job_id": 3, "priority": 4, "arrival_time": 2 }
    ]
  }'
```
**Expected:** `[2, 3, 1]`

---

### Test Case 2: Same Priority - job_id Tiebreaker
```bash
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "jobs": [
      { "job_id": 5, "priority": 3, "arrival_time": 0 },
      { "job_id": 2, "priority": 3, "arrival_time": 0 },
      { "job_id": 8, "priority": 3, "arrival_time": 0 }
    ]
  }'
```
**Expected:** `[2, 5, 8]` (sorted by job_id)

---

### Test Case 3: Delayed Arrivals
```bash
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "jobs": [
      { "job_id": 1, "priority": 5, "arrival_time": 10 },
      { "job_id": 2, "priority": 1, "arrival_time": 0 }
    ]
  }'
```
**Expected:** `[2, 1]` (Job 2 executes first despite lower priority)

---

### Test Case 4: Single Job
```bash
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "jobs": [
      { "job_id": 1, "priority": 5, "arrival_time": 3 }
    ]
  }'
```
**Expected:** `[1]`

---

### Test Case 5: Validation Error
```bash
curl -X POST http://localhost:3000/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "jobs": [
      { "job_id": 1, "priority": 3, "arrival_time": 2 },
      { "job_id": 1, "priority": 4, "arrival_time": 1 }
    ]
  }'
```
**Expected:** Error - Duplicate job_id

---

## 🏗️ Project Structure
```
job-scheduler/
├── scheduler.js       # Core scheduling logic
├── server.js          # Express API + validation
├── package.json       # Dependencies
└── README.md          # Documentation
```

**Architecture:**
- **scheduler.js** - Pure logic (no HTTP, easily testable)
- **server.js** - API layer (validation, routing, responses)
- Clean separation of concerns

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
PORT=4000 npm start
```

**Module not found:**
```bash
npm install
```

**Validation errors:**
- Check all jobs have job_id, priority, arrival_time
- Ensure no duplicate job_ids
- Verify all values are integers >= 0

---
