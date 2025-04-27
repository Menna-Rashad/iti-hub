<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SupportTicket;
use Illuminate\Support\Facades\Auth;


class SupportTicketAdminController extends Controller
{
    public function index(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $query = SupportTicket::with('user')->latest();
    
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
    
        return response()->json($query->latest()->get());
    }
}
