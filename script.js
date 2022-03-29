const connectDB = require('./config/db');
const File = require('./model/share');
const fs = require('fs');

connectDB();


async function fetchData() {
    const files = await File.find({ createdAt : { $lt: new Date(Date.now() - 1*60 * 1000)} })
    if(files.length) {
        for (const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.filename}`);
            } catch(err) {
                console.log(`error while deleting file ${err} `);
            }
        }
        console.log('done');
    }
}

fetchData().then(process.exit);