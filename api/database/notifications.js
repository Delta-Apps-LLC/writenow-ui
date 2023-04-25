exports.getNotifs = async function (client, userid) {
    const { rowCount, rows } = await client.query({
        name: 'get-notifs',
        text: 'SELECT * FROM notifications WHERE userid = $1 ORDER BY date DESC',
        values: [
            userid
        ],
    })
    return rowCount > 0 ? rows : undefined
}

exports.sendNotif = async function (client, userid, senderid, sendername, date, journalid, text, title) {
    const { rowCount, rows } = await client.query({
        name: 'send-notif',
        text: 'INSERT INTO notifications (userid, senderid, sendername, date, journalid, text, title) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING RETURNING *',
        values: [
            userid,
            senderid,
            sendername,
            date,
            journalid,
            text,
            title,
        ],
    })
    return rowCount > 0 ? rows[0] : undefined
}

exports.markRead = async function (client, notifid, seen) {
    const { rowCount, rows } = await client.query({
        name: 'update-notif',
        text: 'UPDATE notifications SET seen=$1 WHERE notifid=$2 RETURNING *',
        values: [
            seen,
            notifid,
        ],
    })
    return rowCount > 0 ? rows[0] : undefined
}

exports.markAllAsRead = async function (client, userid) {
    const { rowCount, rows } = await client.query({
        name: 'mark-all-as-read',
        text: 'UPDATE notifications SET seen=true WHERE userid=$1 RETURNING *',
        values: [
            userid,
        ],
    })
    return rowCount > 0 ? rows : undefined
}