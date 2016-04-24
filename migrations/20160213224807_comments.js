exports.up = function(knex, Promise) {
    	return knex.schema.createTable('comments', function(table){
		table.increments(); //create id SERIAL PRIMARY KEY
		table.string('comment_username');
		table.integer('comment_post_id');
		table.specificType('comment_body', 'text[]');
	});


};

exports.down = function(knex, Promise) {
  	return knex.schema.dropTable('comments'); 
};
