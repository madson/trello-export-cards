# trello-export-cards

1. Install dependencies: `npm install`;
1. Install Jest: `npm install -g jest`;
1. Edit `state` object on `specs/tasks_from_list.spec.js` with desired board and list name;
1. Run `jest`;
1. Grab the `listId` and your `idMember` from the output;
1. Edit `state` object on `cards_from_list.js` with the IDs gathered above;
1. Run `node cards_from_list`;
