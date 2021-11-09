const messenger = require('../lib/messenger')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Get tired of the same old dodge animation?. What's your weight class now? Your options are "light", "medium", or "heavy".`)
    interaction.user.flow.state = 'weightEdit'
}