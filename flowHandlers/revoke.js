const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')
const grants = require('../data/grants')
const logger = require('../lib/logger')

module.exports = (message) => {
    let parts = message.content.split(" ")
    try {
        logger.info(`${message.author.id} revoked ${parts[1]} from user ${parts[0]}.`)
        grants.set(parts[0], parts[1], false)
        messenger.send(message.author, `Alright, I've revoked ${parts[1]} from user ${parts[0]}.`, menuFactory.getManageGrantsMenu(message.author))
    } catch (err) {
        logger.error(`Failed to revoke ${parts[1]} from user ${parts[0]}: ${err}`)
        messenger.send(message.author, `Uhh, that didn't work. Check the log.`, menuFactory.getManageGrantsMenu(message.author))
    }

    message.author.flow.state = 'idle'
}