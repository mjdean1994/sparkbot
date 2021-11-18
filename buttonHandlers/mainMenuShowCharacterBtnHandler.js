const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (interaction) => {
    messenger.sendEmbed(interaction.user, interaction.user.character.embed, menuFactory.getMainMenu(interaction.user))
}