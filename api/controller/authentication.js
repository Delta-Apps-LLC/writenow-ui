module.exports = function (passport) {
    const authenticate = passport.authenticate('local')
    const sgMail = require('@sendgrid/mail')
    require('dotenv').config()

    return {
        login (req, res, next) {
            authenticate(req, res, err => {
                if (err) return next(err)

                if (req.body.isNew) {
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
                    const msg = {
                        template_id: 'd-3cdfd7d337e04634a983fb96a4f86070',
                        to: req.user.username, // Change to your recipient
                        from: {
                            name: 'Write Now',
                            email: 'thibaudeauapps@gmail.com',
                        }
                    }
                    sgMail
                        .send(msg)
                        .then(() => {
                          console.log('Welcome email sent')
                        })
                        .catch((error) => {
                          console.error(error)
                        })
                }

                // Tell the browser to set an extra cookie. This cookie
                // is not secure, but it can help the UI to determine
                // if the user is logged in or not.
                res.cookie('user', JSON.stringify(req.user), {
                    maxAge: 36000000 // expires in 10 hours
                })
                res.enforcer.status(200).send()
            })
        },

        logout (req, res) {
            if (req.user) req.logout()
            res.clearCookie('user')
            res.enforcer.status(200).send()
        }
    }
}

