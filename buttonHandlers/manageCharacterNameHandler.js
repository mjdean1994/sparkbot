const messenger = require('../lib/messenger')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Oooo, need a new identity, huh? What's your new name?`)
    interaction.user.flow.state = 'nameEdit'
}