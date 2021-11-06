const { MessageActionRow, MessageButton } = require('discord.js')

module.exports.getMainMenu = () => {
    let row = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('mainMenuShowCharacterBtn').setLabel('Show Character').setStyle('PRIMARY'))
        .addComponents(new MessageButton().setCustomId('mainMenuManageCharacterBtn').setLabel('Manage Character').setStyle('PRIMARY'))
    return [row]
}

module.exports.getManageCharacterMenu = () => {
    let row1 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('manageCharacterName').setLabel('Name').setStyle('PRIMARY'))
        .addComponents(new MessageButton().setCustomId('manageCharacterCompany').setLabel('Company').setStyle('PRIMARY'))
        .addComponents(new MessageButton().setCustomId('manageCharacterLevel').setLabel('Level').setStyle('PRIMARY'))
        .addComponents(new MessageButton().setCustomId('manageCharacterGearscore').setLabel('Gearscore').setStyle('PRIMARY'))
    let row2 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('manageCharacterWeapons').setLabel('Weapons').setStyle('PRIMARY'))
        .addComponents(new MessageButton().setCustomId('manageCharacterWeight').setLabel('Weight').setStyle('PRIMARY'))
        .addComponents(new MessageButton().setCustomId('manageCharacterNotes').setLabel('Notes').setStyle('PRIMARY'))
    let row3 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('manageCharacterGoBack').setLabel('Go Back').setStyle('DANGER'))
    return [row1, row2, row3]
}