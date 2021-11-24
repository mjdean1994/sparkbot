const messenger = require('../lib/messenger')
const logger = require('../lib/logger')
const wars = require("../data/wars")
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let time = message.content
    wars.get(message.author.flow.metadata, (err, war) => {
        if (err) return logger.error(`Failed to get war: ${err}`)
        try {
            war.time = time
        } catch (ex) {
            messenger.send(message.author, ex)
            return
        }

        messenger.sendMenu(message.author, menuFactory.getWarSubMenu(war, message.author))

        message.author.flow.state = 'idle'
    })
}