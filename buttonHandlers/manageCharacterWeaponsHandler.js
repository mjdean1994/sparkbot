const messenger = require('../lib/messenger')

module.exports = (interaction) => {
    messenger.send(interaction.user, `I can definitely update your weapons. What's the first weapon you're using now?`)
    interaction.user.flow.state = 'weapon1Edit'
}