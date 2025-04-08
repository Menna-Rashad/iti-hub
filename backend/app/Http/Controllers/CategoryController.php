<?php

namespace App\Http\Controllers;

use App\Models\Category; // Make sure to import the Category model
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        // Fetch all categories from the database
        $categories = Category::all();

        // Return categories as JSON
        return response()->json($categories);
    }
}
