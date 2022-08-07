/**
 * @albertsongs (https://github.com/albertsongs)
 */
class Logger {
    constructor(appLogElem, logLevel) {
        this.appLogElem = appLogElem;
        this.setLogLevel(logLevel);
    }

    setLogLevel(logLevel) {
        this.logLevel = logLevel;
        if(logLevel === 'debug') {
            this.appLogElem.style.setProperty('display', 'block');
        }
    }

    debug(mess) {
        if(this.logLevel !== 'debug') {
            return;
        }
        let logItem = document.createElement("p");
        logItem.innerText = mess;
        this.appLogElem.appendChild(logItem);
    }
}