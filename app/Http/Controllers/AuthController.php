<?php

namespace App\Http\Controllers;

use Twitter;
use Session;
use Redirect;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function index()
    {
        return view('auth.index');
    }

    public function login()
    {
        Twitter::reconfig([
            'token'  => '',
            'secret' => ''
        ]);

        $token = Twitter::getRequestToken(route('auth.callback'));

        if (isset($token['oauth_token_secret']))
        {
            // 認証画面のURLを取得し、リダイレクト
            $url = Twitter::getAuthorizeURL($token, true, false);

            Session::put('oauth_request_token', $token['oauth_token']);
            Session::put('oauth_request_token_secret', $token['oauth_token_secret']);

            return Redirect::to($url);
        }

        // エラー時にはとりあえずログイン画面に戻す
        return Redirect::route('auth.index');
    }

    public function callback(Request $request)
    {
        try {
            // キャンセルが押されたときの処理
            // deniedが必ずパラメータについているのでそれで判断
            $is_cancel = key($request->query()) === 'denied' ? true : false;
            if ($is_cancel) return Redirect::route('auth.index');

            // リクエストトークンがセッションに保持されている時だけ動作
            if (Session::has('oauth_request_token'))
            {
                // リクエストトークンとシークレットをそれぞれセット
                $request_token = [
                    'token'  => Session::get('oauth_request_token'),
                    'secret' => Session::get('oauth_request_token_secret'),
                ];

                // ttwitter.phpの配列をマージ
                Twitter::reconfig($request_token);
                $oauth_verifier = false;

                // 付与されたパラメータを取得
                if ($request->has('oauth_verifier'))
                {
                    $oauth_verifier = $request->get('oauth_verifier');
                }

                // アクセストークンを取得
                $token = Twitter::getAccessToken($oauth_verifier);
                if (!isset($token['oauth_token_secret']))
                {
                    // 問題がある場合はとりあえずログイン画面に
                    return Redirect::route('auth.index');
                }

                // 認証に成功したユーザーの情報取得
                $credentials = Twitter::getCredentials();

                // 問題ない時の処理
                if (is_object($credentials) && ! isset($credentials->error))
                {
                    Session::put('access_token', $token);

                    // タイムラインを表示するメソッドへリダイレクト
                    return Redirect::to(env('FRONT_URL'));
                }

                // 問題がある場合はとりあえずログイン画面に
                return Redirect::route('auth.index');
            }
        } catch(\Exception $e) {
            \Session::flash('flash_message', 'ログインに失敗しました。');
            return Redirect::route('auth.index');
        }
    }

    public function logout()
    {
        Session::forget('access_token');

        return Redirect::route('auth.index');
    }

}
