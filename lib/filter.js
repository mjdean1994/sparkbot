let apply = (list, filterString) => {
    let filters = parseFilterString(filterString)
    for (let i = 0; i < filters.length; i++) {
        let subfilters = filters[i]
        let subfilterResult = []
        for (let j = 0; j < subfilters.length; j++) {
            let subfilter = subfilters[j]
            let filtered = []
            if (subfilter.operator == 'equals') {
                filtered = list.filter(x => x[subfilter.key] == subfilter.value)
            } else if (subfilter.operator == 'notequals') {
                filtered = list.filter(x => x[subfilter.key] != subfilter.value)
            } else if (subfilter.operator == 'gt') {
                filtered = list.filter(x => x[subfilter.key] > subfilter.value)
            } else if (subfilter.operator == 'lt') {
                filtered = list.filter(x => x[subfilter.key] < subfilter.value)
            }
            subfilterResult = union(subfilterResult, filtered)
        }
        list = subfilterResult
    }

    return list
}

let parseFilterString = (filterString) => {
    let filterStringComponents = filterString.split("&")
    let filters = []
    for (let i = 0; i < filterStringComponents.length; i++) {
        let parts = filterStringComponents[i].split(".")
        let keyParts = parts[0].split(",")
        let valueParts = parts[2].split(",")
        let subfilters = []
        for (let j = 0; j < keyParts.length; j++) {
            for (let k = 0; k < valueParts.length; k++) {
                subfilters.push({
                    "key": keyParts[j],
                    "operator": parts[1],
                    "value": valueParts[k]
                })
            }
        }
        filters.push(subfilters)
    }

    return filters
}

// either a or b
let union = (a, b) => {
    for (let i = 0; i < b.length; i++) {
        if (!a.includes(b[i])) {
            a.push(b[i])
        }
    }

    return a
}

let intersect = (a, b) => {
    let results = []
    for (let i = 0; i < b.length; i++) {
        if (a.includes(b[i])) {
            results.push(b[i])
        }
    }
    return results
}

let difference = (a, b) => {
    let results = []
    for (let i = 0; i < a.length; i++) {
        if (!b.includes(a[i])) {
            results.push(a[i])
        }
    }
    return results
}

module.exports.apply = apply
module.exports.union = union
module.exports.intersect = intersect
module.exports.difference = difference