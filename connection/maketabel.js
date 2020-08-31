const knex= require('./database');

knex.schema.hasTable('cities').then(async(exists)=> {
    if (!exists) {
      return knex.schema.createTable('cities', (t)=> {
        t.increments('city_id').primary();
        t.string('city_name', 100).unique();
      });
      
    }
  });

  knex.schema.hasTable('users').then(async(exists)=> {
    if (!exists) {
      return knex.schema.createTable('users', (t)=> {
        t.increments('id').primary();
        t.string('name', 100);
        t.string('email', 100).unique();
        t.string('password',100);
        t.integer('age',100).defaultTo(0);
        t.integer('city_id',100).unsigned().references('cities.city_id');
        
      });     
    }
  });


  knex.schema.hasTable('todo').then(async(exists)=> {
    if (!exists) {
      return knex.schema.createTable('todo', (t)=> {
        t.increments('id')
        t.string('text', 1000);
        t.integer('assignedTo',100).unsigned().references('users.id');
        t.dateTime('dueDate',6);
        
      });     
    }
  });
  