exports.search = async function (client, searchText) {
    searchText = `${searchText}%`
    const { rowCount, rows } = await client.query({
        name: 'search-to-share',
        text: 'SELECT a.firstname, a.lastname, a.username, a.userid FROM accounts a WHERE a.username LIKE $1 OR a.firstname LIKE $1 OR a.lastname LIKE $1',
        values: [searchText]
    })
    return rowCount > 0 ? rows : undefined
}

exports.getSharedList = async function (client, entryid) {
    const { rowCount, rows } = await client.query({
        name: 'get-shared-list',
        text: 'SELECT a.username, s.entryid, s.userid FROM accounts a INNER JOIN shared_entries s ON a.userid = s.userid WHERE s.entryid = $1 ORDER BY a.username ASC',
        values: [entryid]
    })
    return rowCount > 0 ? rows : undefined
}

exports.shareEntry = async function (client, entryid, owner, userid) {
    const { rowCount } = await client.query({
        name: 'share-entry',
        text: 'INSERT INTO shared_entries VALUES($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *',
        values: [
            entryid,
            userid,
            owner
        ]
    })
    return rowCount > 0 ? rowCount : undefined
}

exports.sharePrompt = async function (client, promptid, userid, sender) {
    const { rowCount } = await client.query({
        name: 'share-prompt',
        text: 'INSERT INTO shared_prompts VALUES($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *',
        values: [
            promptid, userid, sender
        ]
    })
    return rowCount > 0 ? rowCount : undefined
}

exports.unshareEntry = async function (client, entryid, userid) {
    const { rowCount } = await client.query({
        name: 'unshare-entry',
        text:'DELETE FROM shared_entries WHERE entryid = $1 AND userid = $2 RETURNING *',
        values: [
            entryid,
            userid
        ]
    })
    return rowCount > 0 ? rowCount : undefined
}

exports.unsharePrompt = async function (client, promptid, userid, sender) {
    const { rowCount } = await client.query({
        name: 'unshare-prompt',
        text: 'DELETE FROM shared_prompts WHERE promptid = $1 AND userid = $2 AND sender = $3 RETURNING *',
        values: [
            promptid,
            userid,
            sender
        ]
    })
    return rowCount > 0 ? rowCount : undefined
}

exports.getEntriesSharedWithMe = async function (client, userid) {
    const { rowCount, rows } = await client.query({
        name: 'get-entries-shared-with-me',
        text:'SELECT s.entryid, e.text, e.date, e.promptid, p.prompttext, t.topicid, t.topictext, a.firstname, a.lastname, a.username, a.userid FROM shared_entries s INNER JOIN entries e ON s.entryid = e.entryid INNER JOIN prompts p ON e.promptid = p.promptid INNER JOIN topics t ON p.topicid = t.topicid INNER JOIN accounts a ON s.owner = a.userid WHERE s.userid = $1 ORDER BY s.owner ASC',
        values: [userid]
    })
    return rowCount > 0 ? rows : undefined
}

exports.getPromptsSharedWithMe = async function (client, userid) {
    const { rowCount, rows } = await client.query({
        name: 'get-prompts-shared-with-me',
        text: 'SELECT s.promptid, p.prompttext, t.topicid, t.topictext, a.firstname, a.lastname, a.username, a.userid FROM shared_prompts s INNER JOIN prompts p ON s.promptid = p.promptid INNER JOIN topics t ON p.topicid = t.topicid INNER JOIN accounts a ON s.sender = a.userid WHERE s.userid = $1 ORDER BY s.sender ASC',
        values: [userid]
    })
    return rowCount > 0 ? rows : undefined
}
