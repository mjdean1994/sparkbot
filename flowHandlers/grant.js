const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')
const grants = require('../data/grants')
const logger = require('../lib/logger')

module.exports = (message) => {
    let parts = message.content.split(" ")
    try {
        grants.set(parts[0], parts[1], true)
        logger.info(`${message.author.id} granted ${parts[1]} to user ${parts[0]}.`)
        messenger.send(message.author, `Alright, I've granted ${parts[1]} to user ${parts[0]}.`, menuFactory.getManageGrantsMenu(message.author))
    } catch (err) {
        logger.error(`Failed to grant ${parts[1]} to user ${parts[0]}: ${err}`)
        messenger.send(message.author, `Uhh, that didn't work. Check the log.`, menuFactory.getManageGrantsMenu(message.author))
    }

    message.author.flow.state = 'idle'
}