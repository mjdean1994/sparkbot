const characters = require('../data/characters')
const filter = require('../lib/filter')

const build = (waitlist, rosterConfig, next) => {
    characters.list((err, characterList) => {
        if (err) return next(err, null);
        characterList = characterList.filter(x => waitlist.includes(x.id))
        console.log(characterList.length)
        let matrix = buildCandidateMatrix(characterList, rosterConfig)
        let slots = buildSlotArrayFromMatrix(matrix)
        let resultMatrix = initializeResultMatrix(matrix.length, matrix[0].length)
        while (slots.length > 0) {
            slots = slots.sort((a, b) => a.count - b.count)
            let slot = slots[0] //most urgent slot
            let candidates = matrix[slot.group][slot.member]
            candidates = filterMostUrgent(candidates, matrix) // only the ones with the fewest alternative spots
            if (candidates.length == 0) {
                resultMatrix[slot.group][slot.member] = { name: "N/A" }
            } else {
                let chosen = candidates[0]
                resultMatrix[slot.group][slot.member] = chosen
                matrix = removeChosenCandidate(chosen, matrix)
            }
            slots = slots.slice(1)
        }
        next(null, resultMatrix)
    })
}

// create a 2D array where each group member slot is populated with a list of all candidates that match that criteria
const buildCandidateMatrix = (characterList, rosterConfig) => {
    let matrix = []
    for (let g = 0; g < rosterConfig.length; g++) {
        matrix[g] = []
        for (let m = 0; m < rosterConfig[g].member_criteria.length; m++) {
            let candidates = filter.apply(characterList, rosterConfig[g].member_criteria[m])
            matrix[g][m] = candidates
        }
    }

    return matrix
}

const buildSlotArrayFromMatrix = (matrix) => {
    let slots = []
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            slots.push({
                "group": i,
                "member": j,
                "count": matrix[i][j].length
            })
        }
    }
    return slots
}

const removeChosenCandidate = (chosen, matrix) => {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            matrix[i][j] = matrix[i][j].filter(x => x != chosen)
        }
    }

    return matrix
}

// sort by how many slots a candidate could be placed in, remove all but the ones with the lowest available slots
const filterMostUrgent = (candidates, matrix) => {
    if (candidates.length == 0) {
        return []
    }
    let results = []
    for (let i = 0; i < candidates.length; i++) {
        let candidate = candidates[i]
        let count = getAvailableSlots(candidate, matrix)
        results.push({ candidate: candidate, count: count })
    }

    results = results.sort((a, b) => a - b)
    let lowestCount = results[0].count
    results = results.filter(x => x.count == lowestCount)
    return results.map(x => x.candidate)
}

const getAvailableSlots = (candidate, matrix) => {
    let count = 0;
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j].includes(candidate)) {
                count++
            }
        }
    }

    return count
}

const initializeResultMatrix = (groupNumbers, memberNumbers) => {
    let matrix = []
    for (let i = 0; i < groupNumbers; i++) {
        let members = []
        for (let j = 0; j < memberNumbers; j++) {
            members.push("")
        }
        matrix.push(members)
    }
    return matrix
}

module.exports.build = build