#!/usr/bin/env node

const program = require('commander')
const CardsHelper = require('./lib/cardsHelper.js')
const TrelloHelper = require('./lib/trelloHelper.js')
const MathHelper = require('./lib/mathHelper.js')

require('dotenv').config()

program
    .version('0.1.0')
    .option('-b, --board "<boardName>"', 'Trello board name')
    .option('-l, --list "<listName>"', 'Trello list name')
    .option('-e, --export', 'Data to import to timesheet')
    .option('-t, --time', 'Show PERT estimates')
    .option('-a, --all', 'Show results for all members')
    .parse(process.argv)

if (program.board === undefined) {
    console.log("Board name is required.")
    process.exit(1)
}

if (program.list === undefined) {
    console.log("List name is required.")
    process.exit(1)
}

TrelloHelper.auth({
    key: process.env.TRELLO_KEY,
    token: process.env.TRELLO_TOKEN
})

if (process.env.TRELLO_KEY == undefined) {
    console.log("TRELLO_KEY is required.")
    console.log("Visit https://trello.com/app-key/ for more information.");
    process.exit(1)
}

if (process.env.TRELLO_TOKEN == undefined) {
    console.log("TRELLO_TOKEN is required.")
    console.log("Visit https://trello.com/app-key/ for more information.");
    process.exit(1)
}

let state = {}

const cardsCallbackExport = (cards) => {
    if (program.all) {
        cards.forEach(card => {
            CardsHelper.printCard(card)
        })
    } else {
        cards.forEach(card => {
            if (card.idMembers.includes(state.memberId)) {
                CardsHelper.printCard(card)
            }
        })
    }
}

const cardsCallbackTime = (cards) => {
    let sum = 0
    let optimistic = 0
    let medium = 0
    let pessimistic = 0
    let cardsCount = 0
    let hours = 0
    let name = ""
    let matcher = null

    const regex = /\[\s*(\d+)\s*\S*\s*(\d+)\s*\S*\s*(\d+)\s*(\S*)\s*\]/s

    cards.forEach(card => {
        if (program.all === undefined) {
            if (card.idMembers.includes(state.memberId) === false) { return }
        }

        cardsCount++
        matcher = regex.exec(card.name)

        if (matcher !== null) {
            optimistic = parseFloat( matcher[1] )
            medium = parseFloat( matcher[2] )
            pessimistic = parseFloat( matcher[3] )
            pert = MathHelper.pert(optimistic, medium, pessimistic)
            sum += pert

            hours = MathHelper.round2decimals(pert)
            name = card.name.substring(0, 80)

            console.log(hours + " ------ " + name);
        } else {
            console.log("Not matched - " + card.name);
        }
    })

    console.log();
    console.log("Number of cards: " + cardsCount);
    console.log("Hours sum: " + MathHelper.round2decimals(sum));
}

const listCallback = (list) => {
    if (program.export) {
        TrelloHelper.getCards(list.id, cardsCallbackExport)
    } else {
        TrelloHelper.getCards(list.id, cardsCallbackTime)
    }
}

const boardCallback = (board) => {
    let listName = program.list
    TrelloHelper.getLists(board.id, listName, listCallback)
}

const main = () => {
    let boardName = program.board
    TrelloHelper.getBoard(boardName, boardCallback)
}

if (program.all) {
    main()
} else {
    TrelloHelper.getMe(user => {
        console.log("Filtering results for: " + user.fullName + "\n");
        state.memberId = user.id
        main()
    })
}
