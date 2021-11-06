const characterData = require('../data/characterData')
const flowData = require('../data/flowData')
const { MessageEmbed } = require('discord.js')
const logger = require('../lib/logger')

module.exports = (message) => {
    let primaryWeapon = message.content.toLowerCase()
    let primaryActual = ''

    if (primaryWeapon.includes('sword')) {
        primaryActual = 'Sword and Shield'
    }
    if (primaryWeapon.includes('hammer') || primaryWeapon.includes('maul')) {
        primaryActual = 'War Hammer'
    }
    if (primaryWeapon.includes('spear')) {
        primaryActual = 'Spear'
    }
    if (primaryWeapon.includes('hatchet')) {
        primaryActual = 'Hatchet'
    }
    if (primaryWeapon.includes('rapier')) {
        primaryActual = 'Rapier'
    }
    if (primaryWeapon.includes('great') && primaryWeapon.includes('ax')) {
        primaryActual = 'Great Axe'
    }
    if (primaryWeapon.includes('bow')) {
        primaryActual = 'Bow'
    }
    if (primaryWeapon.includes('musket')) {
        primaryActual = 'Musket'
    }
    if (primaryWeapon.includes('fire')) {
        primaryActual = 'Fire Staff'
    }
    if (primaryWeapon.includes('ice') || primaryWeapon.includes('frost')) {
        primaryActual = 'Ice Gauntlet'
    }
    if (primaryWeapon.includes('life') || primaryWeapon.includes('heal')) {
        primaryActual = 'Life Staff'
    }

    if (!primaryActual) {
        logger.warn(`Rejected input "primaryWeapon" attribute value "${primaryWeapon}" for user ${message.author.id}.`)
        message.author.send({ embeds: [new MessageEmbed().setTitle('You didn\'t specify a weapon that I know. Check the in-game names of the weapons if you aren\'t sure what to call it. Try again when you\'re ready.')] })
        return
    }

    characterData.setAttribute(message.author.id, 'primaryWeapon', primaryActual)

    message.author.send({ embeds: [new MessageEmbed().setTitle(`I'm hearing that your primary weapon is the ${primaryActual}. What's the other weapon you use?`)] })
    flowData.setFlowState(message.author.id, 'weapon2New')
}