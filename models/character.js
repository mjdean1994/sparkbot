const characters = require('../data/characters')
const logger = require('../lib/logger')
const { MessageEmbed } = require('discord.js')

module.exports = class Character {
    constructor(id, name = null, company = null, level = null, gearscore = null, primaryWeapon = null, secondaryWeapon = null, weight = null, notes = null) {
        this.id = id
        this._name = name
        this._company = company
        this._level = level
        this._gearscore = gearscore
        this._primaryWeapon = primaryWeapon
        this._secondaryWeapon = secondaryWeapon
        this._weight = weight
        this._notes = notes
    }

    get name() {
        return this._name
    }

    get company() {
        return this._company
    }

    get level() {
        return this._level
    }

    get gearscore() {
        return this._gearscore
    }

    get primaryWeapon() {
        return this._primaryWeapon
    }

    get secondaryWeapon() {
        return this._secondaryWeapon
    }

    get weight() {
        return this._weight
    }

    get notes() {
        return this._notes
    }

    set name(name) {
        if (name.length > 256) {
            logger.warn(`Rejected input "name" attribute value "${name}" for user ${this.id}.`)
            throw `Whoa, that name is way too long. Try something shorter. Again, it should be your character's in-game name.`
        }

        if (name.startsWith("=")) {
            logger.warn(`Rejected input "name" attribute value "${name}" for user ${this.id}.`)
            throw `It looks like you're trying to do some formula injection. Try again without the equal sign.`
        }
        this._name = name
        characters.setAttribute(this.id, "name", this.name)
    }

    set company(company) {
        if (company.length > 256) {
            logger.warn(`Rejected input "company" attribute value "${company}" for user ${this.id}.`)
            throw `That's a really long name! Why don't you try it again. It should your company's in-game name.`
        }

        if (company.startsWith("=")) {
            logger.warn(`Rejected input "company" attribute value "${company}" for user ${this.id}.`)
            throw `Hmm, something didn't look quite right with that entry. Again, you should be giving me your company's in-game name.`
        }
        if (company == "none") {
            company = ""
        }
        this._company = company
        characters.setAttribute(this.id, "company", this.company)
    }

    set level(level) {
        let valid = true
        if (!Number.isInteger(level)) {
            valid = false
        } else if (level < 1 || level > 60) {
            valid = false
        }

        if (!valid) {
            logger.warn(`Rejected input "level" attribute value "${level}" for user ${this.id}.`)
            throw "Your level has to be an integer between 1 and 60, inclusive. Try again."
        }
        this._level = level
        characters.setAttribute(this.id, "level", this.level)
    }

    set gearscore(gearscore) {
        let valid = true
        if (!Number.isInteger(gearscore)) {
            valid = false
        } else if (gearscore < 1 || gearscore > 600) {
            valid = false
        }

        if (!valid) {
            logger.warn(`Rejected input "gearscore" attribute value "${gearscore}" for user ${this.id}.`)
            throw "Your gearscore has to be an integer between 1 and 600, inclusive. Try again."
        }
        this._gearscore = gearscore
        characters.setAttribute(this.id, "gearscore", this.gearscore)
    }

    set primaryWeapon(primaryWeapon) {
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
        if (primaryWeapon.includes('void')) {
            primaryActual = 'Void Gauntlet'
        }

        if (!primaryActual) {
            logger.warn(`Rejected input "primaryWeapon" attribute value "${primaryWeapon}" for user ${this.id}.`)
            throw 'You didn\'t specify a weapon that I know. Check the in-game names of the weapons if you aren\'t sure what to call it. Try again when you\'re ready.'
        }
        this._primaryWeapon = primaryActual
        characters.setAttribute(this.id, "primaryWeapon", this.primaryWeapon)
    }

    set secondaryWeapon(secondaryWeapon) {
        let secondaryActual = ''

        if (secondaryWeapon.includes('sword')) {
            secondaryActual = 'Sword and Shield'
        }
        if (secondaryWeapon.includes('hammer') || secondaryWeapon.includes('maul')) {
            secondaryActual = 'War Hammer'
        }
        if (secondaryWeapon.includes('spear')) {
            secondaryActual = 'Spear'
        }
        if (secondaryWeapon.includes('hatchet')) {
            secondaryActual = 'Hatchet'
        }
        if (secondaryWeapon.includes('rapier')) {
            secondaryActual = 'Rapier'
        }
        if (secondaryWeapon.includes('great') && secondaryWeapon.includes('ax')) {
            secondaryActual = 'Great Axe'
        }
        if (secondaryWeapon.includes('bow')) {
            secondaryActual = 'Bow'
        }
        if (secondaryWeapon.includes('musket')) {
            secondaryActual = 'Musket'
        }
        if (secondaryWeapon.includes('fire')) {
            secondaryActual = 'Fire Staff'
        }
        if (secondaryWeapon.includes('ice') || secondaryWeapon.includes('frost')) {
            secondaryActual = 'Ice Gauntlet'
        }
        if (secondaryWeapon.includes('life') || secondaryWeapon.includes('heal')) {
            secondaryActual = 'Life Staff'
        }
        if (secondaryWeapon.includes('void')) {
            secondaryActual = 'Void Gauntlet'
        }

        if (!secondaryActual) {
            logger.warn(`Rejected input "secondaryWeapon" attribute value "${secondaryWeapon}" for user ${this.id}.`)
            throw 'You didn\'t specify a weapon that I know. Check the in-game names of the weapons if you aren\'t sure what to call it. Try again when you\'re ready.'
        }
        this._secondaryWeapon = secondaryActual
        characters.setAttribute(this.id, "secondaryWeapon", this.secondaryWeapon)
    }

    set weight(weight) {
        if (weight != "light" && weight != "medium" && weight != "heavy") {
            logger.warn(`Rejected input "weight" attribute value "${weight}" for user ${this.id}.`)
            throw 'Whatever you said was not one of the options I listed. Again, your options are "light", "medium" or "heavy".'

        }
        this._weight = weight.charAt(0).toUpperCase() + weight.slice(1)
        characters.setAttribute(this.id, "weight", this.weight)
    }

    set notes(notes) {
        if (notes.length > 256) {
            logger.warn(`Rejected input "notes" attribute value "${notes}" for user ${this.id}.`)
            throw `Yikes, talking as much as my ex-wife! Can you summarize all that for me? Try to keep it under 256 characters, please.`
        }

        if (notes.startsWith("=")) {
            logger.warn(`Rejected input "notes" attribute value "${notes}" for user ${this.id}.`)
            throw `Uhhh, are you trying to do some injection there or something? Maybe try something that doesn't start with an equal sign.`
        }
        if (notes == "none") {
            notes = ""
        }
        this._notes = notes
        characters.setAttribute(this.id, "notes", this.notes)
    }

    get embed() {
        let embed = new MessageEmbed()
            .setTitle(this._name).setColor("#DAA520")
        embed.addField("Company", this._company || "None", false)
        if (this._level && this._level > 0) {
            embed.addField("Level", "" + this._level, true)
        } else {
            embed.addField("Level", "?", true)
        }
        if (this._gearscore && this._gearscore > 0) {
            embed.addField("Gearscore", "" + this._gearscore, true)
        } else {
            embed.addField("Gearscore", "?", true)
        }
        embed.addField("Weapon 1", this._primaryWeapon || "?", false)
        embed.addField("Weapon 2", this._secondaryWeapon || "?", false)
        embed.addField("Weight", this._weight || "?", false)
        if (this._notes) {
            embed.addField("Notes", this._notes, false)
        }
        return embed
    }

    static fromJson(key, value) {
        let character = new Character(
            key,
            value.name,
            value.company,
            value.level,
            value.gearscore,
            value.primaryWeapon,
            value.secondaryWeapon,
            value.weight,
            value.notes)
        return character
    }
}