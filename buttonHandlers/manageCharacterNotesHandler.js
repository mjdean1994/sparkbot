const messenger = require('../lib/messenger')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Okay, yeah. We can update your notes. What do you want the people to know? You can also say "none" to clear your notes.`)
    interaction.user.flow.state = 'noteEdit'
}