#!/usr/bin/env node

const frisby = require('frisby')
const dotenv = require('dotenv')

dotenv.config()

const state = {
    listId: '5b7749405e591589a537ec6f',
    idMember: '5b721f6b507e447de67296d5'
}

const auth = {
    key: process.env.TRELLO_KEY,
    token: process.env.TRELLO_TOKEN
}

const url = `https://api.trello.com/1/lists/${state.listId}/cards?key=${auth.key}&token=${auth.token}`

shortenURL = (url) => {
    const index = url.lastIndexOf("/")
    const newURL = url.substring(0, index)
    return newURL
}

tidyName = (name) => {
    const index = name.lastIndexOf(":")
    const newName = name.substring(index+1, name.lenght)
    return newName.trim()
}

linkDescription = (name) => {
    name = name.substring(name.lastIndexOf("]")+1, name.lenght)
    name = name.substring(0, name.lastIndexOf("-"))
    return name.trim()
}

printCard = (card) => {
    const regex = /(\d) hours/gm;
    const match = regex.exec(card.name)
    const url = shortenURL(card.url)
    const name = tidyName(card.name)
    const description = linkDescription(card.name)
    const link = `=HYPERLINK("${url}","${description}")`

    console.log(`${link}; ${name}; pull request; ${match[1]};`)
    // console.log(name);
}

frisby.get(url)
    .expect('header', 'content-type', 'application/json; charset=utf-8')
    .expect('status', 200)
    .then(res => {
        res.json.forEach(card => {

            if (card.idMembers.includes(state.idMember) == true) {
                printCard(card)
            }

        });
    })
