const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (msg, logName) => {
    const dateTime = `${format(new Date(), "yyyMMdd\tHH:mm:ss")}`;
    const logItem = `${dateTime}\t${uuid()}\t${msg}\n`; // Add new line for better formatting

    console.log("logItem:", logItem); // Debug: Print logItem to terminal

    try {
        const logsDir = path.join(__dirname, "..", "logs");

        if (!fs.existsSync(logsDir)) {
            console.log("Creating logs directory"); // Debug: Confirm if directory is created
            await fsPromises.mkdir(logsDir);
        } 

        console.log("Appending log to file"); // Debug: Ensure appendFile is reached
        await fsPromises.appendFile(path.join(logsDir, logName), logItem);
    } catch (error) {
        console.log("Error occurred in logEvents:", error); // Debug: Catch and log any errors
    }
};

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    console.log(`${req.method} and ${req.path}`);
    next();
}

module.exports = {logger, logEvents};