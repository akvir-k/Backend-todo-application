module.exports=(router,knex)=>{


    router
        .post('/city',async(req,res)=>{
                
            let data={
                'city_name':req.body.name
            }
            console.log(data)
            await knex('cities').insert(data)
            .then((result)=>{
                res.send(result);
            })
            .catch((err)=>{
                res.send(err);
            })
        })
}