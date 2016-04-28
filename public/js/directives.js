redditApp.directive('modal', function () {
    return {
      template: '<div class="modal fade">' + 
          '<div class="modal-dialog">' + 
            '<div class="modal-content">' + 
              '<div class="modal-header">' + 
                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' + 
                '<h4 class="modal-title">{{ title }}</h4>' + '<h6 class="modal-title">Please provide your information below</h6>'+
              '</div>' + 
              '<div class="modal-body" ng-transclude></div>' + 
            '</div>' + 
          '</div>' + 
        '</div>',
      restrict: 'E',
      transclude: true,
      replace:true,
      scope:true,
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;

        scope.$watch(attrs.visible, function(value){
          if(value == true)
            $(element).modal('show');
          else
            $(element).modal('hide');
        });

        $(element).on('shown.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = true;
          });
        });

        $(element).on('hidden.bs.modal', function(){
          scope.$apply(function(){
            scope.$parent[attrs.visible] = false;
          });
        });
      }
    };
  });

// redditApp.directive('comments', function () {
//   return{
//       template: '<div class="col-xs-4" ng-repeat="comment in comments track by $index" >' +
//               '<div ng-show="!post.commentOn" class="comment" ng-repeat="commenter in comment.comment_body track by $index" >' +
//                         +'<div ng-repeat="commenters in commenter.comments track by $index">'+
//                            '<b>{{commenter.user}}:</b>' +
//                             '<span > {{commenters}}</span>' +
//                         '</div>'+
//                       '</div>' +
//             '</div>',
//             restrict: 'E',
//             scope: { commentData: '=commentData' },
//             link: function(scope, element, attrs) {
//                 var resources = scope.commentData;
//                 console.log(resources.length);
//                 if(resources.length > 1){
//                   scope.comments = resources;
//                 }else{
//                   scope.comments = resources.comment_body;
//                 }
//             }
//   };


// });