const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (interaction) => {
    messenger.sendEmbed(interaction.user, interaction.character.embed, menuFactory.getMainMenu())
}