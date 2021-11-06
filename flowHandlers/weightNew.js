const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const logger = require('../lib/logger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let weightInput = message.content.toLowerCase()

    if (weightInput != "light" && weightInput != "medium" && weightInput != "heavy") {
        logger.warn(`Rejected input "weight" attribute value "${weightInput}" for user ${message.author.id}.`)
        message.author.send({ embeds: [new MessageEmbed().setTitle('Whatever you said was not one of the options I listed. Again, your options are "light", "medium" or "heavy".')] })
        return
    }

    characterData.setAttribute(message.author.id, 'weight', weightInput.charAt(0).toUpperCase() + weightInput.slice(1))

    characterData.getEmbed(message.author.id, (err, embed) => {
        message.author.send({
            embeds: [new MessageEmbed().setTitle(`I'll mark down that you're in ${weightInput} armor. Anything else you want people to know about you? You can just say "none", too.`)]
        })
    })
    flowData.setFlowState(message.author.id, "noteNew")
}