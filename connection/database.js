const { connect } = require('cookies')

const option={
    client:'mysql',
    connection:{
        localhost:process.env.host,
        user:process.env.user,
        password:process.env.password,
        database: process.env.database
    }
};

const knex= require('knex')(option)


module.exports =knex;