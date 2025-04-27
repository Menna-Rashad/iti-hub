<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminLog;
use Illuminate\Support\Facades\Auth;

class AdminLogController extends Controller
{
    public function index()
    {
        $logs = AdminLog::with('admin:id,name') 
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'admin_name' => $log->admin->name ?? 'Unknown Admin',
                    'action' => $log->action,
                    'created_at' => $log->created_at->format('Y-m-d H:i:s'), 
                ];
            });

        return response()->json($logs);
    }
}
