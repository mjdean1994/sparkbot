const wars = require('../data/wars')
const logger = require('../lib/logger')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const messenger = require('../lib/messenger')
const characters = require('../data/characters')

const buildRosterDetail = (characterList, roster) => {
    let rosterDetail = []
    for (let group = 0; group < 10; group++) {
        rosterDetail.push([])
        for (let slot = 0; slot < 5; slot++) {
            if (roster[group].length < slot + 1 || !roster[group][slot]) {
                rosterDetail[group].push(null)
            } else {
                let character = characterList.filter(x => x.id == roster[group][slot])[0]
                rosterDetail[group].push(character)
            }
        }
    }

    return rosterDetail
}

module.exports = class War {
    constructor(id, owner, name, timestamp, roster, waitlist) {
        this.id = id
        this._owner = owner
        this._name = name
        this._time = new Date(timestamp)
        this._roster = roster
        this._waitlist = waitlist
        this._detailedWaitlist = null
        this._detailedRoster = null
    }

    get name() {
        return this._name
    }

    get owner() {
        return this._owner
    }

    get time() {
        return this._time.toLocaleString("en-US", { "timeZone": "America/New_York" })
    }

    get timestamp() {
        return this._time.getTime()
    }

    get roster() {
        return this._roster
    }

    get waitlist() {
        return this._waitlist
    }

    get detailedRoster() {
        return this._detailedRoster
    }

    get detailedWaitlist() {
        return this._detailedWaitlist
    }

    generateDetailedLists(next) {
        characters.list((err, characterList) => {
            if (err) return next(err, null);
            this._detailedWaitlist = characterList.filter(x => this._waitlist.includes(x.id))
            this._detailedRoster = []
            for (let i = 0; i < 10; i++) {
                this._detailedRoster.push([])
                for (let j = 0; j < 5; j++) {
                    let id = this._roster[i][j]
                    if (!id) {
                        this._detailedRoster[i].push(null)
                    } else {
                        this._detailedRoster[i].push(characterList.filter(x => x.id == id)[0])
                    }
                }
            }
            next(null, this)
        })
    }

    set name(name) {
        if (name.length > 100) {
            logger.warn(`Rejected input "name" attribute value "${name}" for war ${this.id}.`)
            throw `Whoa, that name is way too long. Try something shorter.`
        }

        logger.info(`War name for ${this._name} updated to ${name}.`)
        this._name = name
        wars.setAttribute(this.id, "name", this._name)
    }

    set time(time) {
        let t = new Date(time)
        if (isNaN(t)) {
            logger.warn(`Rejected input "time" attribute value "${time}" for war ${this.id}.`)
            throw `Uhh, that doesn't look like a date and time to me. Try again.`
        }

        this._time = t
        logger.info(`War time for ${this._name} updated to ${t}.`)
        wars.setAttribute(this.id, "time", t.getTime())
    }

    rosterIncludes(id) {
        let filtered = this._roster.filter(x => x.includes(id))
        return filtered.length > 0
    }

    addToWaitlist(id) {
        this._waitlist.push(id)
        wars.setAttribute(this.id, "waitlist", this._waitlist)
        logger.info(`User ${id} was added to waitlist for ${this._name}.`)
    }

    removeFromWaitlist(id) {
        let index = this._waitlist.indexOf(id)
        if (index < 0) {
            return;
        }
        this._waitlist.splice(index, 1)
        wars.setAttribute(this.id, "waitlist", this._waitlist)
        logger.info(`User ${id} was removed from waitlist for ${this._name}.`)
        this.removeFromRoster(id)
    }

    removeFromRoster(id) {
        if (this._roster.filter(x => x.includes(id)).length == 0) {
            logger.info(`User ${id} was not found on roster for ${this._name}.`)
            return
        }

        for (let group = 0; group < 10; group++) {
            for (let slot = 0; slot < 5; slot++) {
                if (this._roster[group][slot] == id) {
                    this._roster[group][slot] = null
                    if (this._detailedRoster) {
                        this._detailedRoster[group][slot] = null
                    }
                }
            }
        }
        logger.info(`User ${id} was removed from roster for ${this._name}.`)
        messenger.sendDirectMessage(this._owner, `:warning: User ${id} left the roster for ${this._name}.`)
        wars.setAttribute(this.id, "roster", this._roster)
    }

    setSlot(groupId, slotId, character) {
        let previous = this._roster[groupId][slotId]
        if (!character) {
            this._roster[groupId][slotId] = null
            if (this._detailedRoster) {
                this._detailedRoster[groupId][slotId] = null
            }
            logger.info(`Group ${groupId}, Slot ${slotId} has been cleared for ${this._name}.`)
        } else {
            this._roster[groupId][slotId] = character.id
            if (this._detailedRoster) {
                this._detailedRoster[groupId][slotId] = character
            }
            logger.info(`Group ${groupId}, Slot ${slotId} has been filled by ${character.name} for ${this._name}.`)
            if (previous != character.id) {
                let row = new MessageActionRow().addComponents(new MessageButton().setCustomId(`warRsvpDecline.${this.id}`).setLabel(`I can't make it!`).setStyle("DANGER"))
                messenger.sendDirectMessage(character.id, `You have been selected for ${this._name}! Please make sure you've signed up at the war board in-game and are online 30 minutes prior to the war time.`, [row])
            }
        }
        if (previous && (character == null || previous != character.id)) {
            messenger.sendDirectMessage(previous, `You have been removed from the roster for ${this._name}.`)
        }
        wars.setAttribute(this.id, "roster", this._roster)
    }

    getRosterString(groupIndex) {
        let members = []
        let group = this._roster[groupIndex]
        for (let i = 0; i < 5; i++) {
            if (!group[i]) {
                members.push("Empty")
            } else {
                if (this._detailedRoster) {
                    members.push(this._detailedRoster[groupIndex][i].name)
                } else {
                    members.push(group[i])
                }
            }
        }

        return members.join("\n")
    }

    static fromJson(key, value) {
        return new War(key, value.owner, value.name, value.time, value.roster, value.waitlist)
    }

    getEmbed(user) {
        let status = this.getStatus(user)

        let embed = new MessageEmbed()
            .setTitle(this._name).setColor("#DAA520")
            .setDescription(`:calendar: <t:${this._time.getTime() / 1000}>`)
            .addField("Status", `${status.icon} ${status.message}`)
            .addField("Participants", this._waitlist.length + "")

        for (let i = 0; i < 10; i++) {
            embed.addField(`Group ${i + 1}`, this.getRosterString(i), true)
        }
        return embed
    }

    delete(next) {
        wars.delete(this.id, next)
    }

    getStatus(user) {
        let status = {
            icon: ":red_circle:",
            message: "Not on Standby"
        }
        if (this._waitlist.includes(user.id)) {
            status.icon = ":yellow_circle:",
                status.message = "On Standby"
        }
        if (this.rosterIncludes(user.id)) {
            status.icon = ":green_circle:"
            status.message = "On Roster"
        }
        return status
    }
}