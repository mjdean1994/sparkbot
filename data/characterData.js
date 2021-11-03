const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const sheets = require('./sheets')
const logger = require('../lib/logger')

let locked = false;

module.exports.create = (discordId, next) => {
    _acquireLock(() => {
        _get((err, obj) => {
            if (err) {
                _unlock()
                return next(err, null);
            }
            obj[discordId] = { name: discordId }
            _set(obj, (err) => {
                _unlock()
                if (err) return next(err);
                logger.info(`Created new character for user ${discordId}.`)
                next(err)
            })
        })
    })
}

module.exports.getAll = (next) => {
    _acquireLock(() => {
        _get((err, obj) => {
            _unlock()
            if (err) return next(err, null);
            next(null, obj)
        })
    })
}

module.exports.getByDiscordId = (discordId, next) => {
    _acquireLock(() => {
        _get((err, obj) => {
            _unlock()
            if (err) return next(err, null);
            next(null, obj[discordId])
        })
    })
}

module.exports.getEmbed = (discordId, next) => {
    _acquireLock(() => {
        _get((err, obj) => {
            _unlock()
            if (err) return next(err, null);
            let character = obj[discordId]
            let embed = new MessageEmbed()
                .setTitle(character.name).setColor("#DAA520")
            if (character.level) {
                embed.addField("Level", "" + character.level, true)
            }
            if (character.gearscore) {
                embed.addField("Gearscore", "" + character.gearscore, true)
            }
            if (character.primaryWeapon) {
                embed.addField("Weapon 1", character.primaryWeapon, false)
            }
            if (character.secondaryWeapon) {
                embed.addField("Weapon 2", character.secondaryWeapon, false)
            }
            if (character.weight) {
                embed.addField("Weight", character.weight, false)
            }

            next(null, embed)
        })
    })
}

module.exports.reset = (discordId, next = () => { }) => {
    _acquireLock(() => {
        _get((err, obj) => {
            if (err) {
                _unlock()
                return next(err, null);
            }
            obj[discordId] = { "name": discordId }
            _set(obj, (err) => {
                _unlock()
                if (err) return next(err)
                logger.info(`Reset character information for user ${discordId}.`)
                next(err)
            })
        })
    })
}

module.exports.setAttribute = (discordId, attributeName, attributeValue, next = () => { }) => {
    _acquireLock(() => {
        _get((err, obj) => {
            if (err) {
                _unlock()
                return next(err, null);
            }
            obj[discordId][attributeName] = attributeValue
            _set(obj, (err) => {
                _unlock()
                logger.info(`Set attribute "${attributeName}" to "${attributeValue}" for user ${discordId}.`)
                next(err)
            })
        })
    })
}

const _acquireLock = (next) => {
    if (!_lock()) {
        setTimeout(() => _acquireLock(next), 100)
    } else {
        next()
    }
}

const _get = (next) => {
    fs.readFile('./data/characterData.json', 'utf-8', (err, data) => {
        if (err) {
            logger.error("Failed to read characterData.json: " + err)
            return next(err, null);
        }
        next(null, JSON.parse(data))
    })
}

// returns true if locked successfully. otherwise returns false.
const _lock = () => {
    if (locked) return false;
    locked = true;
    return true;
}

const _set = (obj, next) => {
    fs.writeFile('./data/characterData.json', JSON.stringify(obj), (err) => {
        if (err) logger.error("Failed to write to characterData.json: " + err)
        next(err)
    })
    sheets.update(obj)
}

const _unlock = (obj) => {
    locked = false;
}