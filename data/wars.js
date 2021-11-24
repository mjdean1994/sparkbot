const Grant = require('../models/grant')
const lockfile = require('proper-lockfile')
const fs = require('fs')
const logger = require('../lib/logger')
const { v4: uuidv4 } = require('uuid')
const War = require('../models/war')

const file = "./data/warData.json"
let cache = null

const get = (warId, next) => {
    lockfile.lock(file)
        .then((release) => {
            _get((err, obj) => {
                release()
                if (err) {
                    return next(`Failed to get wars: ${err}`, null);
                }
                War.fromJson(warId, obj[warId]).generateDetailedLists(next)
            })
        })
        .catch((err) => {
            return next(`Failed to acquire lock for file ${file}: ${err}`, null)
        })
}

const getUpcoming = (next) => {
    lockfile.lock(file)
        .then((release) => {
            _get((err, obj) => {
                release()
                if (err) {
                    return next(`Failed to get wars: ${err}`, null);
                }
                let now = Date.now()
                let upcoming = Object.entries(obj).filter(x => x[1].time > now);
                next(null, upcoming.map(x => War.fromJson(x[0], x[1])))
            })
        })
        .catch((err) => {
            return next(`Failed to acquire lock for file ${file}: ${err}`, null)
        })
}

const deleteWar = (warId, next) => {
    lockfile.lock(file)
        .then((release) => {
            _get((err, obj) => {
                if (err) {
                    release()
                    return next(`Failed to get wars: ${err}`, null);
                }
                delete obj[warId]
                _set(obj, (err) => {
                    release()
                    if (err) return next(err, null);
                    logger.info(`Deleted war with id ${warId}.`)
                    next(null)
                })
            })
        })
        .catch((err) => {
            return next(`Failed to acquire lock for file ${file}: ${err}`, null)
        })
}

const create = (owner, next) => {
    let warId = uuidv4();
    let newWar = { owner: owner, waitlist: [], roster: [[null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null]] }
    lockfile.lock(file)
        .then((release) => {
            _get((err, obj) => {
                if (err) {
                    release()
                    return next(`Failed to get wars: ${err}`, null);
                }
                obj[warId] = newWar
                _set(obj, (err) => {
                    release()
                    if (err) return next(err, null);
                    logger.info(`Created new war with id ${warId} owned by ${owner}.`)
                    War.fromJson(warId, newWar).generateDetailedLists(next)
                })
            })
        })
        .catch((err) => {
            return next(`Failed to acquire lock for file ${file}: ${err}`, null)
        })
}

const setAttribute = (warId, attributeName, attributeValue, next = () => { }) => {
    lockfile.lock(file)
        .then((release) => {
            _get((err, obj) => {
                if (err) {
                    release()
                    return next(`Failed to get wars: ${err}`, null);
                }
                obj[warId][attributeName] = attributeValue
                _set(obj, (err) => {
                    release()
                    if (err) return next(err, null);
                    War.fromJson(warId, obj[warId]).generateDetailedLists(next)
                })
            })
        })
        .catch((err) => {
            return next(`Failed to acquire lock for file ${file}: ${err}`, null)
        })
}

const _get = (next) => {
    if (cache) return next(null, cache);
    fs.readFile(file, 'utf-8', (err, data) => {
        if (err) {
            logger.error(`Failed to read ${file}: ${err}`)
            return next(err, null);
        }
        next(null, JSON.parse(data))
    })
}

const _set = (obj, next) => {
    fs.writeFile(file, JSON.stringify(obj), (err) => {
        if (err) logger.error(`Failed to write to ${file}: ${err}`)
        else cache = obj;
        next(err)
    })
}

module.exports.create = create
module.exports.get = get;
module.exports.setAttribute = setAttribute;
module.exports.getUpcoming = getUpcoming
module.exports.delete = deleteWar;