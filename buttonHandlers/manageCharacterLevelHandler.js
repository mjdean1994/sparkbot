const messenger = require('../lib/messenger')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Alright, moving up in the world. What level are you now?`)
    interaction.user.flow.state = 'levelEdit'
}