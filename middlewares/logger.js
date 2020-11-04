const fs = require('fs');
const path = require('path');

createFormattedDate = (date) => {
    return [
        date.getFullYear(),
        (date.getMonth() + 1).toString().padStart(2, '0'),
        date.getDate().toString().padStart(2, '0')
    ].join('-');
};

exports.textLogger = (message) => {
    let logFile = path.join(process.cwd(), `AttendanceMonitoringLogs-${createFormattedDate(new Date())}`);

    fs.appendFile(logFile, `${message}`, { flag: 'a' }, (error) => {
        if (error) {
            console.log(`Error writing logs: ${error}`);
            return;
        }

        console.log(`Done writing textfile in: ${logFile}`);
    });
};

