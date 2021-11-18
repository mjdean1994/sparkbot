const logger = require('../lib/logger')

module.exports = (interaction) => {
    try {
        require(`./${interaction.customId.split('.')[0]}Handler.js`)(interaction)
        interaction.message.delete()
    } catch (ex) {
        logger.error(`Failed to process button click with ID "${interaction.customId}": ${ex}.`)
    }
    interaction.deferUpdate();
}