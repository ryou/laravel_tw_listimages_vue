<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/api/get_lists', 'ApiController@getLists')->name('api.get_lists');
Route::get('/api/get_list_images/{id}/{page}', 'ApiController@getListImages')->name('api.get_list_images');
Route::get('/api/logout', 'ApiController@logout')->name('api.logout');
Route::get('/api/api_test', 'ApiController@api_test')->name('api.api_test');
Route::post('/api/add_favorite/{id}', 'ApiController@addFavorite')->name('api.add_favorite');
Route::post('/api/delete_favorite/{id}', 'ApiController@deleteFavorite')->name('api.delete_favorite');
Route::post('/api/retweet/{id}', 'ApiController@retweet')->name('api.retweet');
Route::post('/api/unretweet/{id}', 'ApiController@unretweet')->name('api.unretweet');

Route::get('/auth/login', 'AuthController@login')->name('auth.login');
Route::get('/auth/callback', 'AuthController@callback')->name('auth.callback');
