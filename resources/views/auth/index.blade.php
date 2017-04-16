@extends('layouts.meta')

@section('body')
  <div id="Contents">
    <div class="l-container">
      @if (\Session::has('flash_message'))
        <div class="m-alert">
          <p>{{ \Session::get('flash_message') }}</p>
        </div>
      @endif
      <div class="loginBlock u-align-center">
        <a href="/auth/login" class="m-btn">ログイン</a>
      </div>
      <!-- /.loginBlock -->
    </div>
  </div>
  <!-- /#Contents -->
@endsection
