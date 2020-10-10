var app = angular.module('multipleInputs',[]);

app.directive('ngFiles', ['$parse', function ($parse) {

    function fn_link(scope, element, attrs) {
      var onChange = $parse(attrs.ngFiles);
      element.on('change', function (event) {
        onChange(scope, { $files: event.target.files });
      });
    };

    return {
      link: fn_link
    }
}]);

app.controller('multipleInputsCtrl',function($scope, $http) {

  $scope.user = {
    contacts: [
      {}
    ],
    templates: [
      {
        email: 'dancing@bettwe.com',
        subject: 'test Subject',
        message: 'Test Message',
      },
      {
        email: 'val@yahoo.com',
        subject: 'Test MEssag 1 Subject',
        message: 'Test Message',
      },
      {
        email: 'val@gmail.com',
        subject: 'test Subject',
        message: 'Test ',
      },
    ]
  }

  var formdata = new FormData();
   
  $scope.addContact = function() {
    var newContact = {};
    $scope.user.contacts.push(newContact);
  }
   
   $scope.removeContact = function(contact) {
      var index = $scope.user.contacts.indexOf(contact);
      $scope.user.contacts.splice(index,1);
   }

  $scope.getTheFiles = function ($files) {
    console.log($files)
      angular.forEach($files, function (value, key) {
          formdata.append('csv', value);
      });
  };

  // NOW UPLOAD THE FILES.
  $scope.uploadFiles = function () {

  for ( var key in $scope.user ) {
    formdata.append(key, JSON.stringify($scope.user[key]));
  }

  var req = {
    method: 'POST',
    url: '/api/generate-templates',
    headers: {
      'Content-Type': undefined
    },
    data: formdata
  }

  $http(req).then(function(success) {
      console.log(success)
      console.log('success')
    }, function(err){
      console.log(err)
      console.log('failed')
    });
  }


});
