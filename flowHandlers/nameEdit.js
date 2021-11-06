const { MessageEmbed } = require('discord.js')
const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const logger = require('../lib/logger')
const menuFactory = require('../lib/menuFactory')

module.exports = (message) => {
    let nameInput = message.content

    if (nameInput.length > 256) {
        logger.warn(`Rejected input "name" attribute value "${nameInput}" for user ${message.author.id}.`)
        message.author.send({ embeds: [new MessageEmbed().setTitle(`Whoa, that name is way too long. Try something shorter. Again, it should be your character's in-game name.`)] })
        return;
    }

    if (!nameInput.match(/^[a-zA-Z][a-zA-Z0-9 .,]*$/g)) {
        logger.warn(`Rejected input "name" attribute value "${nameInput}" for user ${message.author.id}.`)
        message.author.send({ embeds: [new MessageEmbed().setTitle(`That name doesn't look like a valid New World name to me. Again, it should be your character's in-game name.`)] })
        return;
    }

    characterData.setAttribute(message.author.id, 'name', nameInput)

    message.author.send({
        embeds: [new MessageEmbed().setTitle(`I think that's a great name, ${nameInput}. Anything else you want to change?`)],
        components: menuFactory.getManageCharacterMenu()
    })
    flowData.setFlowState(message.author.id, 'idle')
}