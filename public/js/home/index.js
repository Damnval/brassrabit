// initialize angular app
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

  // set default values on fields
  $scope.user = {
    contacts: [
      {
        subject: 'Hello, {{ first_name }} {{ last_name }}!',
        message: 'Is {{ company }} the name of your Company, Mr./Mrs. {{ last_name }}?',
      },
      {
        subject: 'Hello, {{ first_name }}!',
        message: 'Do you think this would be useful for {{ company }}?',
      },
      {
        subject: 'Hi, {{ first_name }}!',
        message: 'What is your {{ email }} and {{ gender }} please?',
      },
      {
        subject: 'Hi, {{ first_name }}!',
        message: 'Can you tell me your {{ gender }}?',
      }
    ],
    templates: []
  }

  // Use formdata on submission for excel
  var formdata = new FormData();
  
  /**
   * Will add new contact in contacts array
   * 
   * @returns void
   */
  $scope.addContact = function() {
    var newContact = {};
    $scope.user.contacts.push(newContact);
  }
   
  /**
   * Will remove the selected index in contacts array
   * 
   * @returns void
   */
  $scope.removeContact = function(contact) {
    var index = $scope.user.contacts.indexOf(contact);
    $scope.user.contacts.splice(index,1);
  }

  /**
   * Appends the file in formdata on selection file
   * 
   * @returns void
   */
  $scope.getTheFiles = function ($files) {

      angular.forEach($files, function (value, key) {
          formdata.append('excel_file', value);
      });
  };

 /**
   * Upload or sending the file and data to API
   * 
   * @returns void
   */
  $scope.uploadFiles = function () {

    // simple validation of file if it is setted
    if(!document.getElementById('file').files[0]){
      return;
    }
    // show loading animation
    swal.showLoading();

    // converts array of field to formdata
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
 
    // Http request to send data to backEnd or API
    $http(req).then(
        function(res) {

          if(res.data.results){
            $scope.user.templates = res.data.results.contacts
          }
          $scope.alertMessage( res.data.results.message, 'success');

        }, 
        function(err){
          var err_message = err.data.error;

          $scope.alertMessage(err_message, 'error');

        }
      ).finally(function() {
        // close loading animation
        setTimeout(function(){ 
          swal.close()
        }, 3000);
      });

  }

  /**
   * Dynamic that alerts a message 
   * 
   * @param string message 
   * @param string type 
   */
  $scope.alertMessage= function(message, type){ 	 									
    Swal.fire({
        position: 'center',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 1500
    })
  }

});
