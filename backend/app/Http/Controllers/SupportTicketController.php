<?php

namespace App\Http\Controllers;

use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SupportTicketController extends Controller
{
    public function index()
    {
        return SupportTicket::where('user_id', Auth::id())->latest()->get();
    }

    public function store(Request $request)
    {
        \Log::info('Auth ID:', ['id' => Auth::id()]);
        try {
            $userId = Auth::id();
    
            if (!$userId) {
                return response()->json(['message' => 'Not Authenticated'], 401);
            }
    
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'priority' => 'required|in:low,medium,high',
                'category' => 'nullable|string|max:100',
            ]);
    
            $ticket = SupportTicket::create(array_merge(
                ['user_id' => $userId],
                $validated
            ));            
    
            return response()->json([
                'message' => 'Ticket created successfully',
                'ticket' => $ticket
            ], 201);
    
        } catch (\Exception $e) {
            return response()->json([
                'error' => true,
                'msg' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
    
    

    public function show($id)
    {
        $ticket = SupportTicket::with('replies')->findOrFail($id);

        if ((int) $ticket->user_id !== (int) Auth::id()) {

            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $ticket;
    }
}
