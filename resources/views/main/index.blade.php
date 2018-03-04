<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Twitter List Images Viewer</title>

  <link rel="manifest" href="/manifest.json">

  <meta name="csrf-token" content="{{ csrf_token() }}">

  <link href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' rel="stylesheet">
  <link href="https://use.fontawesome.com/releases/v5.0.8/css/all.css" rel="stylesheet">
  @loadLocalCSS(/assets/fontawesome.min.css)
</head>
<body>
  <div id="app"></div>

  <script src="./assets/bundle.js"></script>
</body>
</html>
