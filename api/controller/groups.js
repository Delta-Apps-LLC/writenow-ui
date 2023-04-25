const accounts = require('../database/groups')

module.exports = function (pool) {
	return {
		async createGroup (req, res) {
			const { groupname, joincode } = req.enforcer.body
			const group = await accounts.createAccount(pool, groupname, joincode)
			if (group) {
				res.enforcer.status(201).send()
			} else {
				res.enforcer.status(409).send()
			}
		},
	}
}