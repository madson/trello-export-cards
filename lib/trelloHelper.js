const request = require('request')

const _auth = {}

const auth = (obj) => {
    _auth.key = obj.key
    _auth.token = obj.token
}

const getMe = (callback) => {
    const url = `https://api.trello.com/1/members/me/`
    const endpoint = {
            url: url,
            json: true,
            qs: { key: _auth.key, token: _auth.token }
        }

    request.get(endpoint, (error, response, json) => {
        callback(json)
    })
}

const getListsFromBoard = (boardId, listName, callback) => {
    const url = `https://api.trello.com/1/boards/${boardId}/lists`
    const endpoint = {
            url: url,
            json: true,
            qs: { key: _auth.key, token: _auth.token }
        }

    request.get(endpoint, (error, response, json) => {
        json.forEach(list => {
            if (list.name == listName) {
                callback(list)
                return
            }
        })
    })
}

const getCardsFromList = (listId, callback) => {
    const url = `https://api.trello.com/1/lists/${listId}/cards`
    const endpoint = {
            url: url,
            json: true,
            qs: { key: _auth.key, token: _auth.token }
        }

    request.get(endpoint, (error, response, json) => {
        callback(json)
    })
}

const getCardsFromBoard = (boardId, callback) => {
    const url = `https://api.trello.com/1/boards/${boardId}/cards`
    const endpoint = {
            url: url,
            json: true,
            qs: { key: _auth.key, token: _auth.token }
        }

    request.get(endpoint, (error, response, json) => {
        callback(json)
    })
}

const getBoard = (name, callback) => {
    const url = 'https://api.trello.com/1/members/me/boards'
    const options = {
            url: url,
            json: true,
            qs: { key: _auth.key, token: _auth.token }
        }

    request.get(options, (error, response, json) => {
        json.forEach(board => {
            if (board.name == name) {
                callback(board)
                return
            }
        })
    })
}

module.exports = {
    auth: auth,
    getMe: getMe,
    getBoard: getBoard,
    getListsFromBoard: getListsFromBoard,
    getCardsFromList: getCardsFromList,
    getCardsFromBoard: getCardsFromBoard
}
