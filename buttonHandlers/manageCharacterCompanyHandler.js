const messenger = require('../lib/messenger')

module.exports = (interaction) => {
    messenger.send(interaction.user, `New friends, new experiences, I hope! What's your company's name? You can also say "none" if you're not in one at the moment.`)
    interaction.user.flow.state = 'companyEdit'
}