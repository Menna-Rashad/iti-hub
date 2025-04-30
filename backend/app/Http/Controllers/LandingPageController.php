<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class LandingPageController extends Controller
{
    public function news()
    {
        return response()->json(News::latest()->get());
    }
}
