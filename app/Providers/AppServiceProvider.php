<?php

namespace App\Providers;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
        /***********************************************************************
        ローカルのCSS,JSファイルを読み込む際に、更新日を付与することでキャッシュを
        適応するか否か判断できるようにするディレクティブ
        ファイルパスはルート相対パスで記述すること
        [使用例]
        @loadLocalCSS(/common/css/base.css)
        @loadLocalJS(/common/js/common.js)
        **********************************************************************/
        Blade::directive('loadLocalCSS', function($filePath) {
            $path = base_path() . "/public" . $filePath;
            return "<link rel=\"stylesheet\" href=\"" . $filePath . "?date=" . "<?php echo \File::lastModified(\"" . $path . "\") ?>" . "\">";
        });
        Blade::directive('loadLocalJS', function($filePath) {
            $path = base_path() . "/public" . $filePath;
            return "<script src=\"" . $filePath . "?date=" . "<?php echo \File::lastModified(\"" . $path . "\") ?>" . "\"></script>";
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
