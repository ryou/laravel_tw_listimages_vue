<?php

namespace App\Http\Controllers;

use Twitter;
use Session;

use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function __construct()
    {
      $this->middleware('auth.twitter');
    }

    public function getLists()
    {
        if (env('USE_FRONT_MOCK', false)) {
            return view('mock.api.get_lists');
        }

        try {
            $lists = Twitter::getLists();
            $json = json_encode($lists);
            return view('main.api')->with('json', $json);
        } catch (\Exception $e) {
            return response($e->getMessage(), $e->getCode());
        }
    }

    public function getListImages($id, $page)
    {
        if (env('USE_FRONT_MOCK', false)) {
            return view('mock.api.get_list_images');
        }

        $timeline = null;

        try {
            if ($id === 'home') {
                $timeline = Twitter::getHomeTimeline([
                    'count' => 200,
                    'page' => $page
                ]);
            } else {
                $timeline = Twitter::getListsStatuses([
                    'list_id' => $id,
                    'count' => 200,
                    'page' => $page
                ]);
            }

            $imgList = [];
            foreach ($timeline as $tweet)
            {
                // デフォルトのretweeted_statusの扱いが微妙なので整理
                if (isset($tweet->retweeted_status))
                {
                    $tmp = $tweet->retweeted_status;
                    $tmp->retweet_user = $tweet->user;
                    $tweet = $tmp;
                }

                if (isset($tweet->extended_entities->media))
                {
                    $cnt = 0;
                    foreach ($tweet->extended_entities->media as $img)
                    {
                        $tmp = array(
                            'status' => $tweet,
                            'index' => $cnt
                        );
                        $imgList[] = $tmp;

                        $cnt++;
                    }
                }
            }

            $shrinkedImgList = [];
            foreach ($imgList as $img)
            {
                $tmp = [
                    'index' => $img['index'],
                    'status' => [
                        'id_str' => $img['status']->id_str,
                        'text' => $img['status']->text,
                        'created_at' => $img['status']->created_at,
                        'favorited' => $img['status']->favorited,
                        'retweeted' => $img['status']->retweeted,
                        'user' => [
                            'id_str' => $img['status']->user->id_str,
                            'name' => $img['status']->user->name,
                            'screen_name' => $img['status']->user->screen_name,
                            'profile_image_url_https' => $img['status']->user->profile_image_url_https,
                        ],
                        'extended_entities' => $img['status']->extended_entities,
                    ],
                ];
                if (isset($img['status']->retweet_user))
                {
                    $tmp['status']['retweet_user'] = [
                        'id_str' => $img['status']->retweet_user->id_str,
                        'name' => $img['status']->retweet_user->name,
                        'screen_name' => $img['status']->retweet_user->screen_name,
                    ];
                }

                $shrinkedImgList[] = $tmp;
            }

            // サイズを抑えるために、マルチバイトUnicodeをエスケープしない
            $json = json_encode($shrinkedImgList, JSON_UNESCAPED_UNICODE);

            return view('main.api')->with('json', $json);
        } catch (\Exception $e) {
            return response($e->getMessage(), $e->getCode());
        }
    }

    public function addFavorite(Request $request)
    {
        $json = null;
        try {
            $json = Twitter::postFavorite([
                'id' => $request->id
            ]);
        } catch (\Exception $e) {
            return response($e->getMessage(), $e->getCode());
        }

        $json = json_encode($json);
        return view('main.api')->with('json', $json);
    }

    public function deleteFavorite(Request $request)
    {
        $json = null;
        try {
            $json = Twitter::destroyFavorite([
                'id' => $request->id
            ]);
        } catch (\Exception $e) {
            return response($e->getMessage(), $e->getCode());
        }

        $json = json_encode($json);
        return view('main.api')->with('json', $json);
    }

    public function retweet(Request $request)
    {
        $json = null;
        try {
            $json = Twitter::postRt($request->id);
        } catch (\Exception $e) {
            return response($e->getMessage(), $e->getCode());
        }

        $json = json_encode($json);
        return view('main.api')->with('json', $json);
    }

    public function unretweet(Request $request)
    {
        $json = null;
        try {
            $json = Twitter::post('statuses/unretweet/' . $request->id, []);
        } catch (\Exception $e) {
            return response($e->getMessage(), $e->getCode());
        }

        $json = json_encode($json);
        return view('main.api')->with('json', $json);
    }

    public function logout()
    {
        Session::forget('access_token');
    }

    public function api_test()
    {
        echo 'test';
    }

}
