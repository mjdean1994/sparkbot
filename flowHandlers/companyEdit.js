const { MessageEmbed } = require('discord.js')
const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const logger = require('../lib/logger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let nameInput = message.content

    if (nameInput.length > 256) {
        logger.warn(`Rejected input "company" attribute value "${nameInput}" for user ${message.author.id}.`)
        message.author.send({ embeds: [new MessageEmbed().setTitle(`That's a really long name! Why don't you try it again. It should your company's in-game name.`)] })
        return;
    }

    if (!nameInput.match(/^[a-zA-Z0-9 .,]*$/g)) {
        logger.warn(`Rejected input "company" attribute value "${nameInput}" for user ${message.author.id}.`)
        message.author.send({ embeds: [new MessageEmbed().setTitle(`Hmm, something didn't look quite right with that entry. Again, you should be giving me your company's in-game name.`)] })
        return;
    }

    let isNone = false
    if (nameInput.toLowerCase() === "none") {
        nameInput = ""
        isNone = true
    }

    characterData.setAttribute(message.author.id, 'company', nameInput)

    if (isNone) {
        message.author.send({
            embeds: [new MessageEmbed().setTitle(`There's nothing wrong with flying solo! Do you need to change something else?`)],
            components: menuFactory.getManageCharacterMenu()
        })
    } else {
        message.author.send({
            embeds: [new MessageEmbed().setTitle(`Ah, yes, ${nameInput}. I'm so glad to have you all fighting for the Covenant! Do you need to change something else?`)],
            components: menuFactory.getManageCharacterMenu()
        })
    }

    flowData.setFlowState(message.author.id, 'idle')
}