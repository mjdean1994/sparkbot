const messenger = require('../lib/messenger')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Nothing quite like some new loot. What is your gearscore, now?`)
    interaction.user.flow.state = 'gearscoreEdit'
}