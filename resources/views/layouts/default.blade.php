<!doctype html>
<html>
  <head>
    @include('includes.head')
    <!-- Include AngularJS -->
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
    <!-- Include AngularJS -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

    <!-- For sweet alert -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
    @stack('scripts')
  </head>
  <body ng-app="multipleInputs" ng-controller="multipleInputsCtrl">
    <div class="container">
      <div>
        @yield('content')
      </div>
      <footer>
        @include('includes.footer')
      </footer>
    </div>
  </body>
</html>