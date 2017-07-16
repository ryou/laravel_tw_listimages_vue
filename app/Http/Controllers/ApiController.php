<?php

namespace App\Http\Controllers;

use Twitter;

use Illuminate\Http\Request;

class ApiController extends Controller
{
    public function __construct()
    {
      $this->middleware('auth.twitter');
    }

    public function getLists()
    {
        $lists = Twitter::getLists();
        echo json_encode($lists);
    }

    public function getHomeImages($page)
    {
        $timeline = Twitter::getHomeTimeline([
            'count' => 200,
            'page' => $page
        ]);

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

        echo json_encode($imgList);
    }

    public function getListImages($id, $page)
    {
        $timeline = Twitter::getListsStatuses([
            'list_id' => $id,
            'count' => 200,
            'page' => $page
        ]);

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

        echo json_encode($imgList);
    }

    public function addFavorite(Request $request)
    {
        Twitter::postFavorite([
            'id' => $request->id
        ]);
    }

    public function deleteFavorite(Request $request)
    {
        Twitter::destroyFavorite([
            'id' => $request->id
        ]);
    }

    public function retweet(Request $request)
    {
        Twitter::postRt($request->id);
    }

    public function unretweet(Request $request)
    {
        Twitter::post('statuses/unretweet/' . $request->id, []);
    }

}
