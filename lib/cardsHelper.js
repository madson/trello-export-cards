const shortenURL = (url) => {
    const index = url.lastIndexOf("/")
    const newURL = url.substring(0, index)
    return newURL
}

const tidyName = (name) => {
    const index = name.lastIndexOf(":")
    const newName = name.substring(index+1, name.lenght)
    return newName.trim()
}

const linkDescription = (name) => {
    name = name.substring(name.lastIndexOf("]")+1, name.lenght)
    name = name.substring(0, name.lastIndexOf("-"))
    return name.trim()
}

const printCard = (card) => {
    const regex = /(\d) hours/gm;
    const match = regex.exec(card.name)
    const url = shortenURL(card.url)
    const name = tidyName(card.name)
    const description = linkDescription(card.name)
    const link = `=HYPERLINK("${url}","${description}")`
    //console.log(name);
    const result = match === null ? 2 : match[1]

    console.log(`${link}; ${name}; pull request; ${result};`)
    // console.log(name);
}

module.exports = {
    printCard: printCard
}
