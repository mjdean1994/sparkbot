const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Oh boy, war is my favorite! Pick a war, any war!`, menuFactory.getManageWarsMenu(interaction.user))
}