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

            $json = json_encode($imgList);
            return view('main.api')->with('json', $json);
        } catch (\Exception $e) {
            return response($e->getMessage(), $e->getCode());
        }
    }

    public function addFavorite(Request $request)
    {
        $json = Twitter::postFavorite([
            'id' => $request->id
        ]);

        $json = json_encode($json);
        return view('main.api')->with('json', $json);
    }

    public function deleteFavorite(Request $request)
    {
        $json = Twitter::destroyFavorite([
            'id' => $request->id
        ]);

        $json = json_encode($json);
        return view('main.api')->with('json', $json);
    }

    public function retweet(Request $request)
    {
        $json = Twitter::postRt($request->id);

        $json = json_encode($json);
        return view('main.api')->with('json', $json);
    }

    public function unretweet(Request $request)
    {
        $json = Twitter::post('statuses/unretweet/' . $request->id, []);

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
