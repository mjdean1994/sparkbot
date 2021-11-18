const messenger = require('../lib/messenger')

module.exports = (interaction) => {
    messenger.send(interaction.user, `Are you absolutely sure you want to delete this war? There's no way to undo this. Type "DELETE" to confirm. Type anything else to cancel.`)
    interaction.user.flow.setStateAndMetadata('warDeleteConfirm', interaction.customId.split(".")[1])
}