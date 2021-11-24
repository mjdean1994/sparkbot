const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (interaction) => {
    messenger.sendMenu(interaction.user, menuFactory.getCharacterMenu(interaction.user.character))
}