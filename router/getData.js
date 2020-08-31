module.exports = (router, knex) => {

    // Get Users Data with Using Filters
    router.get('/users', async (req, res) => {

        let getCookie = req.cookies

        if (getCookie.email) {

            knex('users').select('users.id', 'users.name', 'users.email', 'users.age'
                , 'cities.city_id', 'cities.city_name')
                .join('cities', 'users.city_id', 'cities.city_id')
                .limit(parseInt(req.query.limit))
                .offset(parseInt(req.query.skip))   

                .modify(function (queryBuilder) {

                    if (req.query.ageLessThen && req.query.ageMoreThen) {
                        if (req.query.city_id) {
                            console.log('hello')
                            queryBuilder.where('users.city_id', req.query.city_id)
                            queryBuilder.andWhere('age', '<=', req.query.ageLessThen)
                            queryBuilder.andWhere('age', '>=', req.query.ageMoreThen)
                        }
                        else {
                            queryBuilder.where('age', '<=', req.query.ageLessThen)
                            queryBuilder.andWhere('age', '>=', req.query.ageMoreThen)
                        }

                    }
                    else if ((req.query.ageLessThen && req.query.city_id)) {

                        queryBuilder.where('age', '<=', req.query.ageLessThen)
                        queryBuilder.andWhere('users.city_id', req.query.city_id)

                    }
                    else if ((req.query.ageMoreThen && req.query.city_id)) {

                        queryBuilder.where('age', '>=', req.query.ageMoreThen)
                        queryBuilder.andWhere('users.city_id', req.query.city_id)

                    }
                    else if (req.query.city_id) {
                        console.log('hi')
                        queryBuilder.where('users.city_id', req.query.city_id)
                    }
                    else if (req.query.ageMoreThen) {
                        queryBuilder.where('age', '>=', req.query.ageMoreThen)
                    }
                    else if (req.query.ageLessThen) {
                        queryBuilder.where('age', '<=', req.query.ageLessThen)

                    }
                })
                .then((response) => {
                    let saveData = { 'users': [] }

                    for (user of response) {
                        const { city_id, city_name, ...newDict } = user
                        newDict['city'] = {
                            city_id: user.city_id,
                            city_name: user.city_name
                        }
                        saveData['users'].push(newDict)

                    }
                    res.send(saveData)

                })
        } else {
            console.log('Authontication failed')
            res.send('Authontication failed')
        }

    })


    //Get users Data with by User Id.
    router.get('/users/:user_id', (req, res) => {

        let getCookie = req.cookies

        if (getCookie.email) {
            knex('users').select('users.id', 'users.name', 'users.email', 'users.age'
                , 'cities.city_id', 'cities.city_name')
                .join('cities', 'users.city_id', 'cities.city_id')
                .where('users.id', req.params.user_id)
                .then((response) => {
                    if(response.length>0){
                        let saveData = { 'user': [] }

                        const { city_id, city_name, ...newDict } = response[0]
                            newDict['city'] = {
                                city_id: response[0].city_id,
                                city_name: response[0].city_name
                            }
                            saveData['user'].push(newDict)
                        res.send(saveData)
                    }
                    else{
                        res.send('Please register yourself first!')
                    }
                   
                })

        }else{
            console.log("Authontication failed! Plese login again..")
            res.send("Authontication failed! Plese login again..")
        }
    })



}