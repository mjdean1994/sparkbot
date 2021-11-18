const wars = require('../data/wars')
const logger = require('../lib/logger')
const { MessageEmbed } = require('discord.js')
const rosterBuilder = require('../lib/rosterBuilder')

module.exports = class War {
    constructor(id, owner, name, timestamp, config, roster, waitlist) {
        this.id = id
        this._owner = owner
        this._name = name
        this._time = new Date(timestamp)
        this._config = config
        this._roster = roster || {}
        this._waitlist = waitlist || []
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

    get config() {
        return this._config
    }

    get roster() {
        return this._roster
    }

    get waitlist() {
        return this._waitlist
    }

    set name(name) {
        if (name.length > 100) {
            logger.warn(`Rejected input "name" attribute value "${name}" for war ${this.id}.`)
            throw `Whoa, that name is way too long. Try something shorter.`
        }

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
        wars.setAttribute(this.id, "time", t.getTime())
    }

    set config(config) {
        try {
            let c
            if (typeof config === 'string') {
                c = JSON.parse(config)
            } else {
                c = config
            }
            this._config = c
            wars.setAttribute(this.id, "config", c)
        } catch (err) {
            logger.warn(`Rejected input "config" for war ${this.id}: ${config}`)
            throw `I wasn't able to parse that configuration. Something must be wrong with it.`
        }
    }

    addToWaitlist(id) {
        this._waitlist.push(id)
        wars.setAttribute(this.id, "waitlist", this._waitlist)
    }

    removeFromWaitlist(id) {
        let index = this._waitlist.indexOf(id)
        if (index < 0) {
            return;
        }
        this._waitlist.splice(index, 1)
        wars.setAttribute(this.id, "waitlist", this._waitlist)
    }

    static fromJson(key, value) {
        return new War(key, value.owner, value.name, value.time, value.config, value.roster, value.waitlist)
    }

    getEmbed(user) {
        let status = this._waitlist.includes(user.id) ? ":yellow_circle: On Standby" : ":red_circle: Not on Standby"
        if (this._roster && this._roster.filter(x => x.filter(y => y.id == user.id).length > 0).length > 0) {
            status = ":green_circle: On Roster"
        }

        let embed = new MessageEmbed()
            .setTitle(this._name).setColor("#DAA520")
            .setDescription(`:calendar: ${this._time.toLocaleDateString("en-US", { timeZone: "America/New_York" })}\n:alarm_clock: ${this._time.toLocaleTimeString("en-US", { timeZone: "America/New_York" })}`)
            .addField("Status", status)
            .addField("Number of Sign-Ups", this._waitlist.length + "")
            .addField("Roster", this._roster ? "Complete" : "Pending")
        return embed
    }

    delete(next) {
        wars.delete(this.id, next)
    }

    generateRoster(next) {
        rosterBuilder.build(this._waitlist, this._config, (err, roster) => {
            if (err) {
                logger.error(err)
                next(err, null)
            }
            this._roster = roster
            wars.setAttribute(this.id, "roster", roster)
            next(null, roster)
        })
    }
}