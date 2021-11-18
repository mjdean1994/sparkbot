const messenger = require('../lib/messenger')

module.exports = (interaction) => {
    messenger.send(interaction.user, `We can always change names. What would you like to name this war?`)
    interaction.user.flow.setStateAndMetadata('warNameEdit', interaction.customId.split(".")[1])
}