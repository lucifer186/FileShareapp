const express = require('express')

const app = express()

app.set('view engine', 'ejs');
app.set('views', 'views');
const fileRoute = require('./routes/file')
const showRoute = require('./routes/show')
const downloadRoute = require('./routes/download.js')
const PORT = process.env.PORT || 3000

const connectDB = require('./config/db')

connectDB()

app.use(express.static('public'))
app.use(express.json())
app.use('/api/files', fileRoute)
app.use('/files', showRoute)
app.use('/files/download', downloadRoute )
app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})