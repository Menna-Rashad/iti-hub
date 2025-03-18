<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AdminController extends Controller
{
    public function dashboard()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }

        $users = User::all();
        return response()->json([
            'message' => 'Admin dashboard loaded successfully',
            'users' => $users
        ], 200);
    }
}
