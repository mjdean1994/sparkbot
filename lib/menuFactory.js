const { MessageActionRow, MessageButton, Message } = require('discord.js')
const characterData = require('../data/characterData')
const logger = require('../lib/logger')

module.exports.getMainMenu = (user) => {
    let rows = []
    let row = new MessageActionRow()
    row.addComponents(new MessageButton().setCustomId('mainMenuShowCharacterBtn').setLabel('Show Character').setStyle('PRIMARY'))
    row.addComponents(new MessageButton().setCustomId('mainMenuManageCharacterBtn').setLabel('Manage Character').setStyle('PRIMARY'))
    if (user.grants.warCoordinator || user.wars.length > 0) {
        row.addComponents(new MessageButton().setCustomId('mainMenuManageWarsBtn').setLabel('Manage Wars').setStyle('PRIMARY'))
    } else {
        row.addComponents(new MessageButton().setCustomId('mainMenuManageWarsBtn').setLabel('Manage Wars (Coming Soon)').setDisabled().setStyle('PRIMARY'))
    }
    rows.push(row)
    if (user.grants.admin) {
        let row2 = new MessageActionRow()
            .addComponents(new MessageButton().setCustomId('mainMenuManageGrantsBtn').setLabel('Manage Grants').setStyle('DANGER'))
        rows.push(row2)
    }
    return rows
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
        .addComponents(new MessageButton().setCustomId('manageCharacterGoBack').setLabel('Go Back').setStyle('SECONDARY'))
    return [row1, row2, row3]
}

module.exports.getManageGrantsMenu = (user) => {
    if (!user.grants.admin) {
        return;
    }
    let row = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('manageGrantsGrant').setLabel('Grant').setStyle("PRIMARY"))
        .addComponents(new MessageButton().setCustomId('manageGrantsRevoke').setLabel('Revoke').setStyle("PRIMARY"))
    let row2 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('manageGrantsGoBack').setLabel('Go Back').setStyle('SECONDARY'))
    return [row, row2]
}

module.exports.getManageWarsMenu = (user) => {
    let rows = []
    let row = new MessageActionRow()
    if (user.wars.length > 5) {
        logger.warn("Can't display all upcoming wars--there are too many!")
    }
    for (let i = 0; i < user.wars.length && i < 5; i++) {
        row.addComponents(new MessageButton().setCustomId(`showWar.${user.wars[i].id}`).setLabel(user.wars[i].name).setStyle("PRIMARY"))
    }
    if (user.wars.length > 0) {
        rows.push(row)
    }
    let row2 = new MessageActionRow()
    if (user.grants.warCoordinator) {
        row2.addComponents(new MessageButton().setCustomId('manageWarsCreate').setLabel('Create').setStyle("SUCCESS"))
    }
    row2.addComponents(new MessageButton().setCustomId('manageCharacterGoBack').setLabel('Go Back').setStyle("SECONDARY"))
    rows.push(row2)
    return rows
}

module.exports.getWarMenu = (war, user) => {
    let rows = []
    let row = new MessageActionRow()
    if (war.waitlist.includes(user.id)) {
        row.addComponents(new MessageButton().setCustomId(`showWarLeave.${war.id}`).setLabel('Leave Standby').setStyle("DANGER"))
    } else {
        row.addComponents(new MessageButton().setCustomId(`showWarJoin.${war.id}`).setLabel('Join Standby').setStyle("SUCCESS"))
    }
    if (war.roster) {
        row.addComponents(new MessageButton().setCustomId(`showWarRoster.${war.id}`).setLabel('View Roster').setStyle("PRIMARY"))
    }
    rows.push(row)
    if (war.owner == user.id) {
        let row2 = new MessageActionRow()
            .addComponents(new MessageButton().setCustomId(`showWarChangeName.${war.id}`).setLabel('Change Name').setStyle("PRIMARY"))
            .addComponents(new MessageButton().setCustomId(`showWarChangeTime.${war.id}`).setLabel('Change Time').setStyle("PRIMARY"))
            .addComponents(new MessageButton().setCustomId(`showWarChangeConfig.${war.id}`).setLabel('Change Config').setStyle("PRIMARY"))
            .addComponents(new MessageButton().setCustomId(`showWarGenerateRoster.${war.id}`).setLabel('Generate Roster').setStyle("PRIMARY"))
            .addComponents(new MessageButton().setCustomId(`showWarDelete.${war.id}`).setLabel('Delete War').setStyle("DANGER"))
        rows.push(row2)
    }
    let row3 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('showWarGoBack').setLabel('Go Back').setStyle("SECONDARY"))
    rows.push(row3)

    return rows
}