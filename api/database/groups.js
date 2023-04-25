const uuid = require('uuid').v4

exports.createGroup = async function (client, groupname, joincode) {
    const { rowCount, rows } = await client.query({
        name: 'create-group',
        text: 'INSERT INTO group (groupname, joincode) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
        values: [
            groupname,
            joincode,
        ]
    })
    return rowCount > 0 ? rows[0] : undefined
}

exports.joinGroup = async function (client, groupid, userid) {
    const { rowCount, rows } = await client.query({
        name: 'join-group',
        text: 'INSERT INTO member (groupid, userid) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
        values: [
            groupid,
            userid,
        ],
    })
    return rowCount > 0 ? rows[0] : undefined
}
