exports.getTopics = async function (client) {
    const { rowCount, rows } = await client.query({
        name: 'get-topics',
        text: 'SELECT * from topics',
    })
    return rowCount > 0 ? rows : undefined
}