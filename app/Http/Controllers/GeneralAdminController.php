<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\VehiclePermit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GeneralAdminController extends Controller
{
    /**
     * Display the general admin panel.
     */
    public function index()
    {
        $employees = Employee::withCount('permits')->latest()->paginate(15);
        
        $stats = [
            'total_employees' => Employee::count(),
            'total_permits' => VehiclePermit::count(),
            'pending_permits' => VehiclePermit::pending()->count(),
            'departments' => Employee::distinct()->count('department'),
        ];
        
        return Inertia::render('admin/general-panel', [
            'employees' => $employees,
            'stats' => $stats,
        ]);
    }

    /**
     * Export permit data to Excel.
     */
    public function store(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $query = VehiclePermit::with('employee');

        if ($request->start_date) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->end_date) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        $permits = $query->get();

        // Create CSV data
        $csvData = [];
        $csvData[] = [
            'ID',
            'Employee ID',
            'Employee Name',
            'Department',
            'Grade',
            'Vehicle Type',
            'License Plate',
            'Usage Start',
            'Usage End',
            'Purpose',
            'Status',
            'HR Comments',
            'Submitted At',
            'HR Action At',
        ];

        foreach ($permits as $permit) {
            $csvData[] = [
                $permit->id,
                $permit->employee->employee_id,
                $permit->employee->name,
                $permit->employee->department,
                $permit->employee->grade,
                $permit->vehicle_type,
                $permit->license_plate,
                $permit->usage_start->format('Y-m-d H:i:s'),
                $permit->usage_end->format('Y-m-d H:i:s'),
                $permit->purpose,
                ucfirst($permit->status),
                $permit->hr_comments,
                $permit->created_at->format('Y-m-d H:i:s'),
                $permit->hr_action_at?->format('Y-m-d H:i:s') ?? 'N/A',
            ];
        }

        $filename = 'vehicle-permits-' . now()->format('Y-m-d-H-i-s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($csvData) {
            $file = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}