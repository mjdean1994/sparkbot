const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Alright, anything else I can help you with?`, menuFactory.getMainMenu(interaction.user))
}