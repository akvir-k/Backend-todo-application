
module.exports = (router, knex, bcrypt) => {

    router
        .post('/login', async (req, res) => {

            console.log(req.body)
            knex.select('*').from('users')
                .where('email', req.body.email)
                .then((response) => {
                    if (response.length > 0) {
                        if (bcrypt.compareSync(req.body.password, response[0].password)) {
                            res.cookie('email', req.body.email), res.send(req.body.email)
                        } else {
                            res.send('authontication failed')
                        }
                    }else{
                        res.send("Authontication Failed! please register yourself")
                    }
                })
        })


}