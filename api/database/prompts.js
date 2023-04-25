exports.getPrompt = async function (client) {
    const { rows } = await client.query({
        name: 'get-random-prompt',
        text: 'SELECT p.promptid, p.prompttext, p.topicid, t.topictext FROM prompts p INNER JOIN topics t ON p.topicid = t.topicid WHERE p.promptid != 0 LIMIT 1 OFFSET FLOOR(random() * (SELECT COUNT(*) FROM PROMPTS));',
    })
    return rows[0]
}

exports.activePrompt = async function (client, userid) {
    const { rowCount, rows } = await client.query({
        name: 'get-active-prompt',
        text: 'SELECT a.dateadded, a.promptid, p.prompttext, p.topicid, t.topictext FROM active_prompt a INNER JOIN prompts p ON a.promptid = p.promptid INNER JOIN topics t ON p.topicid = t.topicid WHERE a.userid=$1;',
        values: [userid]
    })
    return rowCount > 0 ? rows[0] : undefined
}

exports.setActivePrompt = async function (client, userid, promptid, dateadded) {
    const { rowCount, rows } = await client.query({
        name: 'set-active-prompt',
        text: 'INSERT INTO active_prompt (userid, promptid, dateadded) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING RETURNING *',
        values: [userid, promptid, dateadded]
    })
    return rowCount > 0 ? rows[0] : undefined
}

exports.updateActivePrompt = async function (client, userid, promptid, dateadded) {
    const { rowCount, rows } = await client.query({
        name: 'update-active-prompt',
        text: 'UPDATE active_prompt SET promptid = $1, dateadded = $2 WHERE userid = $3 RETURNING *',
        values: [promptid, dateadded, userid]
    })
    return rowCount > 0 ? rows[0] : undefined
}