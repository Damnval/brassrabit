// initialize angular app
var app = angular.module('multipleInputs', ['ngFileUpload', 'ngDraggable']);

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

app.controller('multipleInputsCtrl',function($scope, $http, $window) {

  
  /**
   * Append the selected variable in field
   * 
   * @returns void
   */
    $scope.onDropCompleteFirstQuarter = function(data, evt, index, modelName) {
      var contact_array = $scope.user.contacts[index];
      let dummy  = [];
      var index = dummy.indexOf(data);
      if (index == -1){
        if(modelName == 'subject'){
         contact_array.subject = contact_array.subject + ' {{ ' + data.variable + ' }}';
        }
        if(modelName == 'message'){
         contact_array.message = contact_array.message + ' {{ ' + data.variable + ' }}';
        }
      }
    }
    
  // set default values on fields
  $scope.user = {
    contacts: [
      {
        subject: 'Hi, {{ first_name }}!',
        message: 'Can you tell me your {{ gender }}?',
      },
      {
        subject: 'Hello, {{ first_name }} {{ last_name }}!',
        message: 'Is {{ company }} the name of your Company, Mr./Mrs. {{ last_name }}?',
      },
      {
        subject: 'Hello, {{ first_name }}!',
        message: 'Do you think this would be useful for {{ company }}?',
      }
    ],
    templates: []
  }

  $scope.interPolationVariables = [];

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
     
    $scope.SelectedFile = $files;
    formdata.append('excel_file', $files);

    //reads the excel file upon upload
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test($scope.SelectedFile.name.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
          var reader = new FileReader();
          //For Browsers other than IE.
          if (reader.readAsBinaryString) {
            reader.onload = function (e) {
              $scope.ProcessExcel(e.target.result);
            };
            reader.readAsBinaryString($scope.SelectedFile);
          } else {
              //For IE Browser.
              reader.onload = function (e) {
                var data = "";
                var bytes = new Uint8Array(e.target.result);
                for (var i = 0; i < bytes.byteLength; i++) {
                  data += String.fromCharCode(bytes[i]);
                }
                $scope.ProcessExcel(data);
              };
              reader.readAsArrayBuffer($scope.SelectedFile);
            }
        } else {

          $scope.alertMessage('This browser does not support HTML5.', 'error');
        }
    } else {     

      $scope.alertMessage('Please upload a valid Excel file.', 'error');
    }
  };
   
  /**
   * Formats the excel and get the firstSheet only
   * 
   * @returns void
   */
  $scope.ProcessExcel = function (data) {
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    var firstSheet = workbook.SheetNames[0];
    //find the header the header
    $scope.getHeader(workbook.Sheets[firstSheet])
  };

  
  /**
   * Getting the header in excel then display it in UI
   * 
   * @returns void
   */
  $scope.getHeader = function(ws){
      const header = []
      const columnCount = XLSX.utils.decode_range(ws['!ref']).e.c + 1;

      for (let i = 0; i < columnCount; ++i) {
        header[i] = { variable: ws[`${XLSX.utils.encode_col(i)}1`].v }
      }


      $scope.interPolationVariables = header;
      console.log($scope.interPolationVariables)
  }

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
