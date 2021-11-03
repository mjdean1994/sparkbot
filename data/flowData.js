const fs = require('fs')
const logger = require('../lib/logger')

let locked = false;

module.exports.getFlowState = (discordId, next) => {
    _acquireLock(() => {
        _get((err, obj) => {
            _unlock()
            if (err) return next(err, null);
            next(null, obj[discordId]);
        })
    })
}

module.exports.setFlowState = (discordId, flowState, next = () => { }) => {
    _acquireLock(() => {
        _get((err, obj) => {
            if (err) {
                _unlock()
                return next(err);
            }
            obj[discordId] = flowState;
            _set(obj, (err) => {
                _unlock()
                if (err) return next(err)
                logger.info(`Set Flow State to "${flowState}" for user ${discordId}.`)
                return next(err)
            })
        })
    })
}

const _acquireLock = (next) => {
    if (!_lock()) {
        setTimeout(_acquireLock, 100)
    } else {
        return next()
    }
}

const _get = (next) => {
    fs.readFile('./data/flowData.json', 'utf-8', (err, data) => {
        if (err) {
            logger.error("Failed to read flowData.json: " + err)
            return next(err, null);
        }
        return next(null, JSON.parse(data))
    })
}

// returns true if locked successfully. otherwise returns false.
const _lock = () => {
    if (locked) return false;
    locked = true;
    return true;
}

const _set = (obj, next) => {
    fs.writeFile('./data/flowData.json', JSON.stringify(obj), (err) => {
        if (err) logger.error("Failed to write to flowData.json: " + err)
        next(err)
    })
}

const _unlock = (obj) => {
    locked = false;
}