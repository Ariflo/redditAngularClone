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
		         					$scope.user.id = data.data.id[0];
		         					$scope.user.username = data.data.username;
		         					$scope.isAuthenticated = true;
		         				}).catch(function(err){
		         					console.log("Please Sign in to gain access to edit forum");
		         				});
		         			}

		         			var _getPosts = function(posts){

	         						if(posts.data === undefined){
	         							return null;
	         						}else{
	         							posts.data.forEach(function(post){
	         								if(post.comment_body[0]){
	         									var comments = JSON.parse(post.comment_body);

	         									$scope.comment_username = comments.user;
	         									$scope.comments = comments.comments;
	         								}
	         							});
	         							$scope.posts = posts.data;
	         						}

		         			}	
		         			Post.get(_getPosts);
		         	
		         			
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
							            //Post.get(_getPosts);

		         					            $scope.newPostData = {};
		         					}
		         			};

		         			$scope.postComment = function(form, post){
		         				post.commentPost = {};

		         				if (form.$valid) {
		         					Comment.query(post, function(comments){

		         						var commentData = comments[0];
		         						
		         						if(commentData !== undefined){

		         							post.comments = [];
		     							var oldComments = JSON.parse(commentData.comment_body[0]);

		         							oldComments.comments.push(post.comment);
		         							post.comments.push(oldComments);

		         							post.commentPost.username = $scope.user.username;
		         							post.commentPost.postId = post.id;
		         							post.commentPost.comments = post.comments;

		         							Comment.save(post.commentPost);
		         							Post.save(post);
		         							//Post.get(_getPosts);
		         						}else{	

		         							commentData = {};
		         							post.comments = [];
		         					                        commentData.comment_body = {user: $scope.user.username, 
		         					                        				        comments: [] };

		         					                        commentData.comment_body.comments.push(post.comment);
		         							post.comments.push(commentData.comment_body);

		         							post.commentPost.username = $scope.user.username;
		         							post.commentPost.postId = post.id;
		         							post.commentPost.comments = post.comments;

			         						Comment.save(post.commentPost)
			         						Post.save(post);
			         						// Post.get(_getPosts);
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
