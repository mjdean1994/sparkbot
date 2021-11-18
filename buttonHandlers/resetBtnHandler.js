const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Oh, we don't do the whole "reset" thing anymore. Here's the new main menu.`, menuFactory.getMainMenu(interaction.user))
}