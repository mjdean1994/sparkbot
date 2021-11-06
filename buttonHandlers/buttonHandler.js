const logger = require('../lib/logger')

module.exports = (interaction) => {
    try {
        require(`./${interaction.customId}Handler.js`)(interaction)
        interaction.message.delete()
    } catch (ex) {
        logger.error(`Could not find button handler for button with ID "${interaction.customId}": ${ex}.`)
    }
    interaction.deferUpdate();
}