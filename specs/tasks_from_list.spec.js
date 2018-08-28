const frisby = require('frisby')
const dotenv = require('dotenv')

dotenv.config()

describe("Trello cards from a list", () => {

    const auth = {
        key: process.env.TRELLO_KEY,
        token: process.env.TRELLO_TOKEN
    }

    const state = {
        boardId: null,
        boardName: '_Sprint 23',
        listId: null,
        listName: 'Completed'
    }

    it("should retur a list of boards", () => {
        return frisby.get(`https://api.trello.com/1/members/me/boards?key=${auth.key}&token=${auth.token}`)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            .expect('status', 200)
            .then(res => {
                res.json.forEach(board => {
                    if (board.name === state.boardName) {
                        state.boardId = board.id
                        console.log(`${board.name} \n${board.url} \n${board.id}`)
                    }
                });
            })
    })

    it("should retur a list of lists", () => {
        return frisby.get(`https://api.trello.com/1/boards/${state.boardId}/lists?key=${auth.key}&token=${auth.token}`)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            .expect('status', 200)
            .then(res => {
                res.json.forEach(list => {
                    if (list.name === state.listName) {
                        state.listId = list.id
                        console.log(`${list.name} \n${list.id}`)
                    }
                });
            })
    })

    it("should retur a list of cards from a given list", () => {
        return frisby.get(`https://api.trello.com/1/lists/${state.listId}/cards?key=${auth.key}&token=${auth.token}`)
            .expect('header', 'content-type', 'application/json; charset=utf-8')
            .expect('status', 200)
            .then(res => {
                res.json.forEach( (card, index) => {
                    console.log(`Card: ${card.name} - idMembers: ${card.idMembers}`)
                });
            })
    })
});
