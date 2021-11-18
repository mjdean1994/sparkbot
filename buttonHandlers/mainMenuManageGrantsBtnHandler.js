const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Alright. Are we granting or revoking?`, menuFactory.getManageGrantsMenu(interaction.user))
}