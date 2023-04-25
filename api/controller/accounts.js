const accounts = require('../database/accounts')
const bcrypt = require('bcryptjs')

module.exports = function (pool) {
	return {
		async createAccount (req, res) {
			const { firstname, lastname, username, password } = req.enforcer.body
			const userid = await accounts.createAccount(pool, firstname, lastname, username, password)
			if (userid) {
				res.set('location', '/api/accounts/' + userid)
					.enforcer
					.status(201)
					.send()
			} else {
				res.enforcer.status(409).send()
			}
		},

		async getNotifTime (req, res) {
			const { userid } = req.enforcer.params
			const notifTime = await accounts.getNotifTime(pool, userid)
			if (notifTime !== undefined) {
				res.enforcer.status(200).send(notifTime)
			} else {
				res.enforcer.status(400).send()
			}
		},

		async updateAccount (req, res) {
			const currentPass = req.enforcer.query.currentPass
			const newPass = req.enforcer.query.newPass
			const notif_time = req.enforcer.query.notif_time
			const { userid } = req.enforcer.params

			const client = await pool.connect()
			try {
				await client.query('BEGIN')
				let account = await accounts.getAccount(client, userid)
				if (account === undefined) {
					res.enforcer.status(404).send()
				} else if (account.userid !== req.user.id) {
					res.enforcer.status(403).send()
				} else {
					if (currentPass === undefined && newPass === undefined) {
						if (notif_time === undefined) {
							res.enforcer.status(400).send()
						} else {
							const success = await accounts.updateNotifTime(client, account.userid, notif_time)
							if (success !== undefined) res.enforcer.status(200).send()
							else res.enforcer.status(400).send()
						}
					} else {
						const match = await bcrypt.compare(currentPass, account.password)
						if (match) {
							if (notif_time === undefined) {
								const success = await accounts.updatePassword(client, account.userid, newPass)
								if (success !== undefined) res.enforcer.status(200).send()
								else res.enforcer.status(400).send()
							} else {
								const success = await accounts.updateAccount(client, account.userid, newPass, notif_time)
								if (success !== undefined) res.enforcer.status(200).send()
								else res.enforcer.status(400).send()
							}
						} else {
							res.enforcer.status(401).send()
						}
					}
				}
				await client.query('COMMIT')
			} catch (e) {
				await client.query('ROLLBACK')
				throw e
			} finally {
				client.release()
			}
		},

		async deleteAccount (req, res) {
			const { userid } = req.enforcer.params
			const client = await pool.connect()
			try {
				await client.query('BEGIN')
				let account = await accounts.getAccount(client, userid)
				if (account === undefined) {
					res.enforcer.status(204).send()
				} else if (account.userid != userid) {
					res.enforcer.status(403).send()
				} else if (account.userid == userid) {
					await accounts.deleteAccount(pool, account.userid)
					res.enforcer.status(204).send()
				} else {
					res.enforcer.status(400).send()
				}
				await client.query('COMMIT')
			} catch (e) {
				await client.query('ROLLBACK')
				throw e
			} finally {
				client.release()
			}
		},
	}
}