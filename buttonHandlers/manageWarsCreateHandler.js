const messenger = require('../lib/messenger')
const wars = require('../data/wars')
const logger = require('../lib/logger')

module.exports = (interaction) => {
    wars.create(interaction.user.id, (err, war) => {
        if (err) return logger.error('Failed to create war!')
        messenger.send(interaction.user, `The drums of war sound once more! What would you like to name this war?`)
        interaction.user.flow.setStateAndMetadata('warNameNew', war.id)
    })
}