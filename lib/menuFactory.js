const { MessageActionRow, MessageButton, Message, MessageEmbed } = require('discord.js')
const { users } = require('../client')
const characterData = require('../data/characterData')
const logger = require('../lib/logger')

module.exports.getMainMenu = (user) => {
    let embed = new MessageEmbed()
        .setTitle('SparkBot - Praise the Spark!')
        .setDescription("SparkBot is a war and roster management tool created by Magnus von Kepp. It's sole purpose is to make roster management easier for war coordinators by presenting character information in an easy-to-consume form and by providing tools to war coordinators to make roster construction easier.\n\n[Roster Spreadsheet](https://docs.google.com/spreadsheets/d/1Uz2ltnnkQKmzMESLlV4FezepSCM1Lnk-w3Bs-KVj4eg/edit?usp=sharing)\n[GitHub Repository](https://github.com/mjdean1994/sparkbot)")
        .setColor("#DAA520")
    let components = []
    let row = new MessageActionRow()
    row.addComponents(new MessageButton().setCustomId('mainMenuManageCharacterBtn').setLabel('Manage Character').setStyle('PRIMARY'))
    row.addComponents(new MessageButton().setCustomId('mainMenuManageWarsBtn').setLabel('Manage Wars (Beta)').setStyle('PRIMARY'))
    components.push(row)
    if (user.grants.admin) {
        let adminRow = new MessageActionRow()
            .addComponents(new MessageButton().setCustomId('mainMenuManageGrantsBtn').setLabel('Manage Grants').setStyle('DANGER'))
        components.push(adminRow)
    }

    return { embeds: [embed], components: components }
}

module.exports.getCharacterMenu = (character) => {
    let embed = character.embed
    let row1 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('manageCharacterName').setLabel('Update Name').setStyle('PRIMARY'))
        .addComponents(new MessageButton().setCustomId('manageCharacterCompany').setLabel('Update Company').setStyle('PRIMARY'))
        .addComponents(new MessageButton().setCustomId('manageCharacterLevel').setLabel('Update Level').setStyle('PRIMARY'))
        .addComponents(new MessageButton().setCustomId('manageCharacterGearscore').setLabel('Update Gearscore').setStyle('PRIMARY'))
    let row2 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('manageCharacterWeapons').setLabel('Update Weapons').setStyle('PRIMARY'))
        .addComponents(new MessageButton().setCustomId('manageCharacterWeight').setLabel('Update Weight').setStyle('PRIMARY'))
        .addComponents(new MessageButton().setCustomId('manageCharacterNotes').setLabel('Update Notes').setStyle('PRIMARY'))
    let row3 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('manageCharacterGoBack').setLabel('Go Back').setStyle('SECONDARY'))
    return { embeds: [embed], components: [row1, row2, row3] }
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

module.exports.getWarMenu = (user) => {
    let warSummary = ""
    if (user.wars.length > 0) {
        if (user.wars.length == 1) {
            warSummary = "There is 1 upcoming war."
        } else {
            warSummary = `There are ${user.wars.length} upcoming wars.`
        }
    } else {
        warSummary = "There are no upcoming wars."
    }

    let embed = new MessageEmbed()
        .setTitle("War Management")
        .setDescription(`From here, you can view upcoming wars and sign up for them as you see fit. If you're a war coordinator, you can also create new wars or manage ones you previously created.\n\n**${warSummary}**`)
        .setColor("#DAA520")
    let rows = []
    let row = new MessageActionRow()
    if (user.wars.length > 5) {
        logger.warn("Can't display all upcoming wars--there are too many!")
    }
    for (let i = 0; i < user.wars.length && i < 5; i++) {
        let status = user.wars[i].getStatus(user.id)
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
    return { embeds: [embed], components: rows }
}

module.exports.getWarSubMenu = (war, user) => {
    let embed = war.getEmbed(user).setColor("#DAA520")
    let components = []
    let row = new MessageActionRow()
    if (war.waitlist.includes(user.id)) {
        if (war.rosterIncludes(user.id)) {
            row.addComponents(new MessageButton().setCustomId(`showWarLeave.${war.id}`).setLabel('Leave Roster').setStyle("DANGER"))
        } else {
            row.addComponents(new MessageButton().setCustomId(`showWarLeave.${war.id}`).setLabel('Leave Standby').setStyle("PRIMARY"))
        }
    } else {
        row.addComponents(new MessageButton().setCustomId(`showWarJoin.${war.id}`).setLabel('Join Standby').setStyle("PRIMARY"))
    }
    components.push(row)
    if (war.owner == user.id) {
        let row2 = new MessageActionRow()
            .addComponents(new MessageButton().setCustomId(`showWarChangeName.${war.id}`).setLabel('Change Name').setStyle("PRIMARY"))
            .addComponents(new MessageButton().setCustomId(`showWarChangeTime.${war.id}`).setLabel('Change Time').setStyle("PRIMARY"))
            .addComponents(new MessageButton().setCustomId(`showWarManageRoster.${war.id}`).setLabel('Manage Roster').setStyle("PRIMARY"))
            .addComponents(new MessageButton().setCustomId(`showWarDelete.${war.id}`).setLabel('Delete War').setStyle("DANGER"))
        components.push(row2)
    }
    let row3 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId('showWarGoBack').setLabel('Go Back').setStyle("SECONDARY"))
    components.push(row3)
    return { embeds: [embed], components: components }
}

module.exports.getWarRosterMenu = (war, user) => {
    let embed = new MessageEmbed()
        .setTitle(`${war.name} - Roster Management`)
        .setDescription("Select a group to modify.").setColor("#DAA520")
    let row = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId(`manageWarGroup.${war.id}.1`).setLabel('Group 1').setStyle("PRIMARY"))
        .addComponents(new MessageButton().setCustomId(`manageWarGroup.${war.id}.2`).setLabel('Group 2').setStyle("PRIMARY"))
        .addComponents(new MessageButton().setCustomId(`manageWarGroup.${war.id}.3`).setLabel('Group 3').setStyle("PRIMARY"))
        .addComponents(new MessageButton().setCustomId(`manageWarGroup.${war.id}.4`).setLabel('Group 4').setStyle("PRIMARY"))
        .addComponents(new MessageButton().setCustomId(`manageWarGroup.${war.id}.5`).setLabel('Group 5').setStyle("PRIMARY"))
    let row2 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId(`manageWarGroup.${war.id}.6`).setLabel('Group 6').setStyle("PRIMARY"))
        .addComponents(new MessageButton().setCustomId(`manageWarGroup.${war.id}.7`).setLabel('Group 7').setStyle("PRIMARY"))
        .addComponents(new MessageButton().setCustomId(`manageWarGroup.${war.id}.8`).setLabel('Group 8').setStyle("PRIMARY"))
        .addComponents(new MessageButton().setCustomId(`manageWarGroup.${war.id}.9`).setLabel('Group 9').setStyle("PRIMARY"))
        .addComponents(new MessageButton().setCustomId(`manageWarGroup.${war.id}.10`).setLabel('Group 10').setStyle("PRIMARY"))
    let row3 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId(`showWar.${war.id}`).setLabel('Go Back').setStyle("SECONDARY"))

    return { embeds: [embed], components: [row, row2, row3] }
}

module.exports.getWarGroupMenu = (war, groupId, user) => {
    let embed = new MessageEmbed()
        .setTitle(`${war.name} - Group ${groupId} Management`)
        .setDescription("Select a slot to modify.").setColor("#DAA520")
    let group = war.detailedRoster[groupId - 1]
    let row = new MessageActionRow()
    for (let i = 0; i < 5; i++) {
        let label = "Empty"
        if (group[i]) {
            label = group[i].name
        }
        row.addComponents(new MessageButton().setCustomId(`manageWarSlot.${war.id}.${groupId}.${i + 1}`).setLabel(label).setStyle("PRIMARY"))
    }
    let row2 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId(`showWarManageRoster.${war.id}`).setLabel('Go Back').setStyle("SECONDARY"))

    return { embeds: [embed], components: [row, row2] }
}

module.exports.getWarSlotMenu = (war, groupId, slotId, user) => {
    let group = war.detailedRoster[groupId - 1]
    let embed = new MessageEmbed()
        .setTitle(`${war.name} - Group ${groupId} Management - Slot ${slotId}`).setColor("#DAA520")
    if (group[slotId - 1]) {
        embed.setDescription(`This slot is currently filled by **${group[slotId - 1].name}**.`)
    } else {
        embed.setDescription(`This slot is currently empty.`)
    }
    let row = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId(`warSlotSelect.${war.id}.${groupId}.${slotId}`).setLabel('Select Character').setStyle("PRIMARY"))
        .addComponents(new MessageButton().setCustomId(`warSlotSearch.${war.id}.${groupId}.${slotId}`).setLabel('Search Waitlist').setStyle("PRIMARY"))
    if (group[slotId - 1]) {
        row.addComponents(new MessageButton().setCustomId(`warSlotClear.${war.id}.${groupId}.${slotId}`).setLabel('Clear Slot').setStyle("DANGER"))
    }
    let row2 = new MessageActionRow()
        .addComponents(new MessageButton().setCustomId(`manageWarGroup.${war.id}.${groupId}`).setLabel('Go Back').setStyle("SECONDARY"))

    return { embeds: [embed], components: [row, row2] }
}