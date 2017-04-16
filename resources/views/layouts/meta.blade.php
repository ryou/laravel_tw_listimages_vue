<!DOCTYPE html>
<html lang="ja" prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#">
  <head>
    <meta charset="utf-8">
    <title>Twitterのリストの画像だけ見るやつ</title>
    <meta name="description" content="page description">
    <meta name="keywords" content="page keywords">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="format-detection" content="telephone=no">
    <meta name="robots" content="noindex,nofollow">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <!-- COMMON CSS-->
    @loadLocalCSS(/common/css/font-awesome.min.css)
    @loadLocalCSS(/common/css/base.css)
    @loadLocalCSS(/common/css/common.css)
    <!-- PAGE ONLY CSS-->
  </head>
  <body>

    @yield('body')

  </body>
</html>
