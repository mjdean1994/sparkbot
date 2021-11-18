const messenger = require('../lib/messenger')

module.exports = (interaction) => {
    if (!interaction.user.grants.admin) {
        return;
    }
    messenger.send(interaction.user, `Alright, give me the Discord ID and the role, separated by a space.`)
    interaction.user.flow.state = 'revoke'
}