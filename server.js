const express= require('express');
const app= express();
const env= require('dotenv').config();
const bcrypt= require('bcrypt');
const knex= require('./connection/database');
const table= require('./connection/maketabel');
const router= express.Router();
const cookie=require('cookie-parser');
const moment= require('moment');

// app.use(paginate())

let port= process.env.port || 5000
app.use(express.json())
app.use(cookie())
// app.use(moment())

app.use('/',router)
require('./router/signup')(router,knex,bcrypt)
require('./router/cities')(router,knex)
require('./router/login')(router,knex,bcrypt)
require('./router/getData')(router,knex)
require('./router/todo')(router,knex)

app.listen(port,(req,res)=>{
    console.log('server running...')
})
