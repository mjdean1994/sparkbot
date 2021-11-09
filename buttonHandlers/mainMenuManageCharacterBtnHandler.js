const messenger = require('../lib/messenger')
const menuFactory = require('../lib/menuFactory')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Sure, we can change up your character. What would you like to update?`, menuFactory.getManageCharacterMenu())
}