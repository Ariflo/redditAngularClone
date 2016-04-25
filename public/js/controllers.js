redditApp.controller('homeController', ['$scope', '$http', '$parse', '$location', '$routeParams', 'User', 'Post' , 'Postit', 'Comment',
	                                     function($scope,  $http,  $parse,  $location,   $routeParams,   User,  Post, Postit, Comment) {

		         			$scope.newPostData = {};
		         			$scope.reveal = false;
		         			$scope.isAuthenticated = false;
		         			$scope.user = {};

		         			if(localStorage.getItem('jwt')){

		         				var  token = localStorage.getItem('jwt');
		         				$http({
		         					method: "GET",
		         					url: "/user/" + token
		         				}).then(function(data) {
		         					$scope.user.id = data.data.decoded.id[0];
		         					$scope.user.username = data.data.decoded.username;
		         					$scope.isAuthenticated = true;
		         				}).catch(function(err){
		         					console.log("Please Sign in to gain access to edit forum");
		         				});
		         			}

		         			Post.get(function(posts){
		         				//console.log(posts.data);
		         				$scope.posts = posts.data;
		         				// var commentData = posts.data.comment_body;
		         				// //console.log(commentData);
		         				// commentData.forEach(function(comment){
		         				// 	//console.log(comment);
		         				// 	var comments = JSON.parse(comment);
		         				// 	$scope.comment_username = comments.user;
		         				// 	$scope.comments = comments.comments;
		         				// });
		         			})
		         			
		         			$scope.toggleModal = function(){
		         			        $scope.showModal = !$scope.showModal;
		         			};	

		         			$scope.toggleSignInModal = function(){
		         			        $scope.showSignInModal = !$scope.showSignInModal;
		         			};
		         			

		         			$scope.signup = function() {
		         					$http({
		         						method: "POST",
		         						url: "/users",
		         						data: $scope.user
		         					}).then(function(data) {
		         						// Save the JWT to localStorage so we can use it later
		         						localStorage.setItem('jwt', data.data.jwt);
		         						$scope.user.id = data.data.id[0];
		         						$scope.user.username = data.data.username;
		         						$scope.isAuthenticated = true;
		         					}).catch(function(err){
		         						console.log(err.message);
		         					});
		         			}

		         			$scope.login = function() {
		         					$http({
		         						method: "POST",
		         						url: "/login",
		         						data: $scope.user
		         					}).then(function(data) {
		         						// Save the JWT to localStorage so we can use it later
		         						localStorage.setItem('jwt', data.data.jwt);
		         						$scope.user.id = data.data.id[0];
		         						$scope.user.username = data.data.username;
		         						$scope.isAuthenticated = true;

		         					}).catch(function(err){
		         						console.log(err.message);
		         					});
		         			}

		         			$scope.signedIn = function(){
		         				$scope.showModal = false;
		         				$scope.showSignInModal = false;
		         			}

		         			$scope.logout = function() {
		         				localStorage.removeItem('jwt');
		         				$scope.isAuthenticated = false;
		         				$scope.user = {};
		         			}


		         		    	$scope.postSubmit = function(form){
		         				if (form.$valid) {
	         							$scope.newPostData.userId = $scope.user.id;
	         							$scope.newPostData.addComment = {}; 
	         							$scope.newPostData.commentOn = false; 
	         							$scope.newPostData.newCommentOn = false;

	         							Post.save($scope.newPostData);
			         					Post.get(function(posts){
				         					 //console.log(posts.data);
				         					 $scope.posts = posts.data;
				         					 // var commentData = posts.data.comment_body;
				         					 // //console.log(commentData);
				         					 // commentData.forEach(function(comment){
				         					 // 	//console.log(comment);
				         					 // 	var comments = JSON.parse(comment);
				         					 // 	$scope.comment_username = comments.user;
				         					 // 	$scope.comments = comments.comments;
				         					 // });
			         				 	})	
		         					         };
		         					         $scope.newPostData = {};
		         			};

		         			$scope.postComment = function(form, post){
		         				post.commentPost = {};
		         				if (form.$valid) {
		         					Comment.get(post, function(comments){
		         						var commentData = comments.data[0].comment_body;
		         						var oldComments = JSON.parse(comments.data[0].comment_body);

		         						if(oldComments !== undefined && oldComments.user ===  $scope.user.username){
		         							oldComments.comments.push(post.comment);
		         							post.comments.push(oldComments);

		         							post.commentPost.username = $scope.user.username;
		         							post.commentPost.postId = post.id;
		         							post.commentPost.comments = post.comments;

		         							Comment.save(post.commentPost);
		         						}else{	
		         							post.comments = [];
		         					                        comments.data.comment_body = {user: $scope.user.username, 
		         					                        				        comments: [] };
		         					                        comments.data.comment_body.comments.push(post.comment);
		         							post.comments.push(comments.data.comment_body);

		         							post.commentPost.username = $scope.user.username;
		         							post.commentPost.postId = post.id;
		         							post.commentPost.comments = post.comments;

		         							Comment.save(post.commentPost);
		         						}
		         					});	
		         				};			
		         			}
		         			
		         			$scope.ratingUp = function(post){

		         				if($scope.isAuthenticated){
		         					Postit.update({id:post.id, stat: 'up'}, function(data){
		         					post.post_score = data.score;
		         					});
		         				}
		         				
		         			}

		         			$scope.ratingDown = function(post){
		         				if($scope.isAuthenticated){
		         					Postit.update({id:post.id}, function(data){
		         					post.post_score = data.score;
		         					});
		         				}
		         			}

		         			$scope.toggleComments = function(post) {
		         				post.commentOn = !post.commentOn;
		         			}

		         			$scope.toggleNewComment = function(post) {
		         				post.newCommentOn= !post.newCommentOn;	
		         			}	 
	                                     }]);
