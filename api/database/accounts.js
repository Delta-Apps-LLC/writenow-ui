const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4

async function encryptPassword (password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}

exports.getAccount = async function (client, userid) {
    const { rows } = await client.query({
        name: 'get-account-by-id',
        text: 'SELECT * FROM accounts WHERE userid=$1',
        values: [userid]
    })
    return rows[0]
}

exports.getAccountByUsername = async function (client, username) {
    const { rows } = await client.query({
        name: 'get-account-by-username',
        text: 'SELECT * FROM accounts WHERE username=$1',
        values: [username]
    })
    return rows[0]
}

exports.createAccount = async function (client, firstname, lastname, username, password) {
    const { rowCount, rows } = await client.query({
        name: 'create-account',
        text: 'INSERT INTO accounts (firstname, lastname, username, password) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING RETURNING userid',
        values: [
            firstname,
            lastname,
            username,
            await encryptPassword(password)
        ]
    })
    return rowCount > 0 ? rows[0] : undefined
}

exports.getNotifTime = async function (client, userid) {
    const { rowCount, rows } = await client.query({
        name: 'get-notif-time',
        text: 'SELECT notif_time FROM accounts WHERE userid = $1',
        values: [userid]
    })
    return rowCount > 0 ? rows[0] : undefined
}

exports.updateAccount = async function (client, userid, newPass, notif_time) {
    const { rowCount } = await client.query({
        name: 'update-account',
        text: 'UPDATE accounts SET password=$1, notif_time=$2 WHERE userid=$3 RETURNING *',
        values: [await encryptPassword(newPass), notif_time, userid]
    })
    return rowCount > 0 ? rowCount : undefined
}

exports.updatePassword = async function (client, userid, newPass) {
    const { rowCount } = await client.query({
        name: 'update-password',
        text: 'UPDATE accounts SET password=$1 WHERE userid=$2 RETURNING *',
        values: [await encryptPassword(newPass), userid]
    })
    return rowCount > 0 ? rowCount : undefined
}

exports.updateNotifTime = async function (client, userid, notif_time) {
    const { rowCount } = await client.query({
        name: 'update-password',
        text: 'UPDATE accounts SET notif_time=$1 WHERE userid=$2 RETURNING *',
        values: [notif_time, userid]
    })
    return rowCount > 0 ? rowCount : undefined
}

exports.deleteAccount = async function (client, userid) {
    const { rowCount } = client.query({
        name: 'delete-account',
        text: 'DELETE FROM accounts WHERE userid=$1',
        values: [userid]
    })
    return rowCount > 0
}