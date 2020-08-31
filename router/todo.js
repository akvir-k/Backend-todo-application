const { parseTwoDigitYear } = require("moment")


module.exports = (router, knex) => {

    //Post Todo
    router.post('/todos', (req, res) => {
        let getCookie = req.cookies
        let oldDate = req.body.dueDate
        let dueDate = new Date(req.body.dueDate)

        let data = req.body
        data.dueDate = dueDate

        if (getCookie.email) {

            knex('users').select('*')
                .join('cities', 'users.city_id', 'cities.city_id')
                .where('users.id', data.assignedTo)
                .then((userResponse) => {
                    if (userResponse.length > 0) {

                        knex('todo').insert(data)
                            .then((response) => {

                                if (response[0] > 0) {

                                    const { password, city_id, city_name, ...newUserData } = userResponse[0]
                                    newUserData["city"] = {
                                        "city_id": userResponse[0].city_id,
                                        "city_name": userResponse[0].city_name
                                    }
                                    let showData = {
                                        "todo": {
                                            "text": data.text,
                                            "assignedTo": newUserData,
                                            "dueDate": oldDate
                                        }
                                    }
                                    res.send(showData)
                                }
                                else {
                                    "Try Again"
                                }
                            })

                    } else {
                        res.send('user does not exit!!')
                    }
                })
        }
    })

    //Get All Users Todo with Using Filers
    router.get('/todos', (req, res) => {


        let fromDueDate = new Date(req.query.fromDueDate)
        let toDueDate = new Date(req.query.toDueDate)
        let getCookie = req.cookies

        if (getCookie.email) {

            knex('todo').select('*')
                .join('users', 'todo.assignedTo', 'users.id')
                .join('cities', 'users.city_id', 'cities.city_id')
                .limit(parseInt(req.query.limit))
                .offset(parseInt(req.query.skip))

                .modify((query) => {

                    if (req.query.assignedTo) {

                        let data = req.query.assignedTo
                        let assignedToData = data.split(",")
                        query.where((builder) => {
                            builder.whereIn('assignedTo', assignedToData)
                        })
                    }
                    else if (req.query.fromDueDate && req.query.toDueDate) {


                        query.where('todo.dueDate', '>=', fromDueDate)
                        query.andWhere('todo.dueDate', '<=', toDueDate)

                    }
                    else if (req.query.fromDueDate) {
                        query.where('todo.dueDate', '>=', fromDueDate)
                    }

                    else if (req.query.toDueDate) {
                        query.where('todo.dueDate', '<=', toDueDate)
                    }

                    else if (req.query.city_id) {
                        query.where('users.city_id', req.query.city_id)
                    }
                   
                })
                .then((response) => {
                    console.log(response)
                    let usersDict = { 'users': [] }
                    for (userData of response) {
                        const { text, assignedTo, dueDate, password, city_id, city_name, ...newUserData } = userData
                        let newTime = new Date(userData.dueDate).toJSON()
                        let newDueDate = newTime.split('T')


                        newUserData['city'] = {
                            'city_id': userData.city_id,
                            'city_name': userData.city_name
                        }
                        let newDict = {
                            'text': userData.text,
                            'assignedTo': newUserData,
                            'dueDate': newDueDate[0]
                        }
                        usersDict['users'].push(newDict)
                    }
                    res.send(usersDict)
                })
        }
        else{
            res.send("Authontication failed ! plase login again")
        }
    })

    //Get todo by user login.
    router.get('/mytodos',(req,res)=>{

        let getCookie=req.cookies
        
        if(getCookie.email){

            knex('todo').select('*')
                .join('users', 'todo.assignedTo', 'users.id')
                .join('cities', 'users.city_id', 'cities.city_id')
                .limit(parseInt(req.query.limit))
                .offset(parseInt(req.query.skip))
                .where('users.email',getCookie.email)
                .then((response)=>{
                    if(response.length>0){

                        let usersDict = { 'todos': [] }

                        for (userData of response) {
                            const { text, assignedTo, dueDate, password, city_id, city_name, ...newUserData } = userData
                            let newTime = new Date(userData.dueDate).toJSON()
                            let newDueDate = newTime.split('T')
    
                            newUserData['city'] = {
                                'city_id': userData.city_id,
                                'city_name': userData.city_name
                            }
                            let newDict = {
                                'text': userData.text,
                                'assignedTo': newUserData,
                                'dueDate': newDueDate[0]
                            }
                            usersDict['todos'].push(newDict)    
                        }
                        res.send(usersDict)
                    }else{
                        res.send("No Todo")
                    }
                   
                })
        }
    })

}