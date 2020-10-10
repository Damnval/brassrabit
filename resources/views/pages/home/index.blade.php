@extends('layouts.default')
@section('content')

{{-- <form  action="/action_page.php"> --}}
<form name="ContactForm">
  <label for="file">Import Contacts</label>
  <input type="file" id="file" name="file" ng-files="getTheFiles($files)"/>

  <div class="pt-3 pb-3">
    <button ng-click="addContact()" class="btn btn-primary">Add Template</button> 
  </div>

  <section ng-repeat="contact in user.contacts">
    <span class="serial-number">@{{ $index + 1 }}.</span>
  
    <div class="form-group">
      <label for="subject">Subject</label>
      <a class="pull-right users-container-inputs-button" ng-click="removeContact(contact)">X</a>
      <input ng-model="contact.subject" type="text" class="form-control" id="subject">
    </div>
    <div class="form-group">
      <label for="message">Message</label>
      <textarea  ng-model="contact.message" class="form-control" id="message" rows="3"></textarea>
    </div>
  </section>

  <div class="pull-right">
    <button type="submit" ng-click="uploadFiles()" class="btn btn-primary">Submit</button>
  </div>

</form>

<table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Email</th>
      <th scope="col">Subject</th>
      <th scope="col">Message</th>
    </tr>
    </thead>
    <tbody>
      <tr ng-repeat="template in user.templates">
        <th scope="row">1</th>
        <td> @{{ template.email }} </td>
        <td> @{{ template.subject }} </td>
        <td> @{{ template.message }} </td>
      </tr>
  </tbody>
</table>


@stop

@push('scripts')
<!-- Styles -->
<link href="{{ asset('css/home/index.css') }}" rel="stylesheet">
<!-- Scripts -->
<script src="{{ asset('js/home/index.js')}}"></script>
@endpush
