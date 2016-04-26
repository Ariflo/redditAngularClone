var express = require('express');
var apiRouter = express.Router();
var knex = require('../db/knex');
var locus = require('locus');
var bcrypt = require('bcrypt');
var  jwt = require('jsonwebtoken');
require('dotenv').config()

//Render index page
apiRouter.get('/', function(req,res,next){
	res.render('index');
})

//Verify user is logged in 
apiRouter.get('/user/:id', function(req, res, next) {
		if (req.headers.authorization) {

			var token = req.headers.authorization.split(' ')[1];
			var decoded = jwt.verify(token, process.env.JWT_SECRET);

			res.send(decoded);
		}
});

//SIGNUP
apiRouter.post('/users', function(req, res) {
	knex('users').where({username: req.body.username}).first().then(function(user){
	  if(user || req.body.password !== req.body.passwordconfirm){

		    res.send({
		        error: JSON.stringify(err),
		        message: "email already in use/passwords do not match"
		    });
	  }else{
	    bcrypt.genSalt(10, function(err, salt){

	        bcrypt.hash(req.body.password, salt, function(err, hash){
	        knex('users').insert({username: req.body.username, password: hash}).returning('id').then(function(id){
	        	// We sign enough information to determine if 
	            // the user is valid in the future. 
	            // In our case, username and password are required
	        	var token = jwt.sign({id: id,
	        			         username: req.body.username
		        	                 }, process.env.JWT_SECRET);

	        	// On success, we send the token back
	        	// to the browser.
	        	res.send({jwt:token, username:req.body.username, id: id});
	        });
	      });
	    });
	  }
	}).catch(function(err){
	        console.log(err);
	        res.send({
	            error: JSON.stringify(err),
	            message: "Error connecting to Database"
	        })
    	});
});

//SIGNIN
apiRouter.post('/login', function(req, res) {
	    knex('users').where({username: req.body.username}).first()
	    .then(function(user){
	    	if(user){
	    		var pass = req.body.password;
	    		bcrypt.compare(pass, user.password, function(err, result){
	    			if(result){
	    				// We sign enough information to determine if
	    				// the user is valid in the future.
	    				// In our case, username and password are required
	    				var token = jwt.sign({ id: user.id,
	    					username: req.body.username
	    				                 }, process.env.JWT_SECRET);

	    				// On success, we send the token back
	    				// to the browser.
	    				res.send({jwt:token, username:user.username, id: user.id});
	    			}else{
					res.send({
			            		error: JSON.stringify(err),
			            		message: "no matching user/password combo"
				        	});
	    			}
	    		});
	    	}else{
	    		res.send({
	                		error: JSON.stringify(err),
	                		message: "no matching user/password combo"
	            	});
	    	}

	    }).catch(function(err){
	        console.log(err);
	        res.send({
	            error: JSON.stringify(err),
	            message: "Error connecting to Database"
	        })
	    });
});

//get Posts from DB
apiRouter.get('/posts', function(req, res, next) {

	knex('posts')
	.join('users', 'posts.user_id', '=', 'users.id')
	.then(function(data){
	    	res.json({data});
	});


	// knex('users')
	
	// .join('post_comments', 'posts.id', '=', 'post_comments.post_id')
	// .join('comments', 'post_comments.post_id', '=', 'comments.comment_post_id ')
	// .then(function(data){
	//     	res.json({data});
	// });
});

//Posts Posts into DB
apiRouter.post('/posts', function(req, res, next) {
	knex('posts')
	.where({id: req.body.id}).first().then(function(post){
		if(post){
			knex('posts')
			.where({id: post.id})
			.first()
			.update({comment_body: req.body.comments})
			.then(function(done){
						return done;
					        })
		}else{
			knex('posts')
			.insert(
			    	{user_id: req.body.userId,
			    	 title:req.body.title,
			    	 img_url:req.body.image,
			    	 post_time: new Date(),
			    	 post_body:req.body.post_body,
			    	 post_score: 0,
			    	 comment_body: []
			}).then(function(done){
				
				return done;
			})
		}
	})
});


//get Comments from DB
apiRouter.get('/comments', function(req, res, next) {
	knex('comments')
	.where({comment_post_id: req.query.id})
	.then(function(data){
	    	res.send(data);
	});
});

//post Comments to DB
apiRouter.post('/comments', function(req, res, next) {
	knex('comments')
	.where({comment_post_id: req.body.postId}).first().then(function(comments){
		if(comments){
			knex('comments')
			.where({comment_post_id: comments.comment_post_id, comment_username: comments.comment_username})
			.first()
			.update({comment_body: req.body.comments})
			.returning('id')
			.then(function(id){
			    knex('post_comments')
			    .insert({post_id: req.body.postId, comment_id: id[0]})
			    .then(function(done){
		
				return done;
			     })
			});
		}else{
			knex('comments')
			.insert({comment_username: req.body.username,
				comment_post_id: req.body.postId,
				comment_body: req.body.comments})
			.returning('id')
			.then(function(id){	
			    knex('post_comments')
			    .insert({post_id: req.body.postId, comment_id: id[0]})
			    .then(function(done){
		
				return done;
			     })
			});
		}
	})
});


apiRouter.put('/posts/:id', function(req, res, next) {
	if(req.body.stat === 'up'){
		knex('posts')
		.where({id:req.body.id})
		.increment('post_score', 1)
		.returning('post_score')
		.then(function(score){
			res.send({score:score[0]});
		});	
	}else{
		knex('posts')
		.where({id:req.body.id})
		.decrement('post_score', 1)
		.returning('post_score')
		.then(function(score){
			res.send({score:score[0]});
		});

	}	

});


module.exports = apiRouter;