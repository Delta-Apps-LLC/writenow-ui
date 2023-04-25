const notifications = require('../database/notifications')

module.exports = function (pool) {
    return {
        async getNotifs(req, res) {
            const userid = req.enforcer.query.userid
            const notifs = await notifications.getNotifs(pool, userid)
			if (notifs !== null && notifs !== undefined) {
				res.enforcer.status(200).send(notifs)
			} else {
				res.enforcer.status(404).send()
			}
        },

        async sendNotif(req, res) {
            const { userid, senderid, sendername, date, journalid, text, title } = req.enforcer.body
            const notif = await notifications.sendNotif(pool, userid, senderid, sendername, date, journalid, text, title)
			if (notif !== null && notif !== undefined) {
				res.enforcer.status(201).send(notif)
			} else {
				res.enforcer.status(400).send()
			}
        },

        async markRead(req, res) {
            const { notifid } = req.enforcer.params
            const { seen } = req.enforcer.body
            const notif = await notifications.markRead(pool, notifid, seen)
			if (notif !== null && notif !== undefined) {
				res.enforcer.status(200).send(notif)
			} else {
				res.enforcer.status(404).send()
			}
        },

        async markAllAsRead(req, res) {
            const userid = req.enforcer.query.userid
            const notifs = await notifications.markAllAsRead(pool, userid)
			if (notifs !== null && notifs !== undefined) {
				res.enforcer.status(200).send(notifs)
			} else {
				res.enforcer.status(404).send()
			}
        },
    }
}