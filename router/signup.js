module.exports = (router, knex, bcrypt) => {

    router
        .post('/users', async (req, res) => {

            let salt = process.env.salt

            let inserData= req.body
            inserData.password= bcrypt.hashSync(inserData.password,10)

            knex('users').insert(inserData)
                .then(async(resp) => {
                    
                    if (resp[0]>0){
                        knex.select('*').from('cities')
                        .where('city_id',inserData.city_id)
                        .then((cityRes)=>{
                            
                            let showData= {}
                            showData['id']=resp[0]
                            cityRes=JSON.parse(JSON.stringify(cityRes))                 
                            const{password,city_id, ...newValue}=inserData
                            showData= Object.assign({},showData,newValue)    
                            showData['city']=cityRes[0]
                            res.send(showData)
                        })
                        
                    }
                })
                .catch((err) => {
                    res.send(err);
                })

        })
}