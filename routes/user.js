const express = require("express")
const userRoutes = express.Router();
const fs = require('fs');

const dataPath = './details/users.json'

const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data);
    fs.writeFileSync(dataPath, stringifyData);
}

const getUserData = () => {
    const jsonData = fs.readFileSync(dataPath);
    return JSON.parse(jsonData);
}

const checkUserExists = (data = [], email = '') => {
    return data.filter(elem => elem.email === email).length > 0;
}

userRoutes.post('/user/add', (req, res) => {
    var existAccounts = getUserData();
    if (checkUserExists(existAccounts, req.body.email)) {
        res.send({ success: false, msg: 'user already exists' });
    } else {
        existAccounts.push({
            ...req.body,
            "id": Math.floor(1000 + Math.random() * 9000)
        });
        saveUserData(existAccounts);
        res.send({ success: true, msg: 'user added successfully' });
    }
})

userRoutes.get('/user/list', (req, res) => {
    const accounts = getUserData()
    res.send(accounts)
})

userRoutes.put('/user/:id', (req, res) => {
    var existAccounts = getUserData()
    fs.readFile(dataPath, 'utf8', (err, data) => {
        const accountId = req.params['id'];
        let foundIndex = existAccounts.findIndex(elem => elem.id == accountId);
        if (foundIndex !== -1) {
            existAccounts[foundIndex] = {
                ...req.body,
                "id": accountId
            };

            saveUserData(existAccounts);
            res.send({ success: true, msg: `user with id ${accountId} has been updated` });
        } else {
            res.send({ success: true, msg: `user with id does not exist` });
        }
    }, true);
});

userRoutes.delete('/user/delete/:id', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        var existAccounts = getUserData()
        const userId = req.params['id'];

        let foundIndex = existAccounts.findIndex(elem => elem.id == userId);
        if (foundIndex !== -1) {
            existAccounts.splice(foundIndex, 1);
            saveUserData(existAccounts);
            res.send({ success: true, msg: `user with id ${userId} has been deleted` });
        } else {
            res.send({ success: true, msg: `user with id does not exist` });
        }
    }, true);
})
module.exports = userRoutes