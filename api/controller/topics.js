const topics = require('../database/topics')

module.exports = function (pool) {
    return {
        async getTopics(req, res) {
            const allTopics = await topics.getTopics(pool)
            if (allTopics !== null && allTopics !== undefined) {
                res.enforcer.status(200).send(allTopics)
            }
            else {
                res.enforcer.status(404).send()
            }
        }
    }
}