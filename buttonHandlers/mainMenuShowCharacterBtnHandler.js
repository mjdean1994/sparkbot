const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')
const logger = require('../lib/logger')

// DEPRECATED
module.exports = (interaction) => {
    logger.warn("Show Character button was clicked but this button is deprecated!")
    messenger.sendMenu(interaction.user, menuFactory.getMainMenu(interaction.user))
}