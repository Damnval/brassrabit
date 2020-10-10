var app = angular.module('multipleInputs',[]);

app.controller('multipleInputsCtrl',function($scope) {
    $scope.contacts = [
        {}
    ];
   
   $scope.addContact = function() {
       var newContact = {};
       $scope.contacts.push(newContact);
   }
   
   $scope.removeContact = function(user) {
       var index = $scope.contacts.indexOf(user);
       $scope.contacts.splice(index,1);
   }
});