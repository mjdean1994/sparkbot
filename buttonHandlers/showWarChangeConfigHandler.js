const messenger = require('../lib/messenger')

module.exports = (interaction) => {
    messenger.send(interaction.user, `It's not too late to make some last second changes. Send me the updated roster configuration file.`)
    interaction.user.flow.setStateAndMetadata('warConfigEdit', interaction.customId.split(".")[1])
}