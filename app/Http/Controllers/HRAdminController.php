<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\VehiclePermit;
use Inertia\Inertia;

class HRAdminController extends Controller
{
    /**
     * Display the HR admin panel.
     */
    public function index()
    {
        $permits = VehiclePermit::with('employee')
            ->latest()
            ->paginate(10);

        $stats = [
            'total' => VehiclePermit::count(),
            'pending' => VehiclePermit::pending()->count(),
            'approved' => VehiclePermit::approved()->count(),
            'rejected' => VehiclePermit::rejected()->count(),
        ];
        
        return Inertia::render('admin/hr-panel', [
            'permits' => $permits,
            'stats' => $stats,
        ]);
    }
}