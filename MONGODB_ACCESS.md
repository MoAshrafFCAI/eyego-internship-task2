# MongoDB Database Access Guide

## Connection Details
- **Host:** `localhost`
- **Port:** `27017`
- **Database:** `eyego`
- **Connection String:** `mongodb://localhost:27017/eyego`
- **Authentication:** None (no username/password required)

## Option 1: MongoDB Compass (GUI - Recommended)

1. **Download MongoDB Compass:**
   - Visit: https://www.mongodb.com/try/download/compass
   - Download and install the Windows version

2. **Connect:**
   - Open MongoDB Compass
   - Paste this connection string: `mongodb://localhost:27017`
   - Click "Connect"
   - Select the `eyego` database from the left sidebar

## Option 2: MongoDB Shell (mongosh) via Docker

Access MongoDB shell directly from the Docker container:

```bash
docker exec -it eyego-internship-task2-mongo-1 mongosh
```

Once connected, switch to your database:
```javascript
use eyego
```

View collections:
```javascript
show collections
```

Query data:
```javascript
db.activities.find().pretty()
```

## Option 3: Install mongosh Locally

1. **Install MongoDB Shell:**
   - Download from: https://www.mongodb.com/try/download/shell
   - Or use npm: `npm install -g mongosh`

2. **Connect:**
   ```bash
   mongosh mongodb://localhost:27017/eyego
   ```

## Option 4: VS Code Extension

1. Install "MongoDB for VS Code" extension
2. Add connection: `mongodb://localhost:27017`
3. Browse the `eyego` database

## Quick Commands (if using mongosh)

```javascript
// Switch to database
use eyego

// List all collections
show collections

// Find all documents in activities collection
db.activities.find()

// Find documents with limit
db.activities.find().limit(10)

// Count documents
db.activities.countDocuments()

// Find by userId
db.activities.find({ userId: "your-user-id" })

// Pretty print
db.activities.find().pretty()
```


