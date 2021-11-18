const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Any other wars you want to check on?`, menuFactory.getManageWarsMenu(interaction.user))
}