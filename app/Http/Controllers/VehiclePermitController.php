<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehiclePermitRequest;
use App\Http\Requests\UpdateVehiclePermitRequest;
use App\Models\Employee;
use App\Models\VehiclePermit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VehiclePermitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $permits = VehiclePermit::with('employee')
            ->latest()
            ->paginate(10);
        
        return Inertia::render('permits/index', [
            'permits' => $permits
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('permits/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVehiclePermitRequest $request)
    {
        $employee = Employee::where('employee_id', $request->employee_id)->first();
        
        $permit = VehiclePermit::create([
            'employee_id' => $employee->id,
            'vehicle_type' => $request->vehicle_type,
            'license_plate' => $request->license_plate,
            'usage_start' => $request->usage_start,
            'usage_end' => $request->usage_end,
            'purpose' => $request->purpose,
        ]);

        // Mock WhatsApp notification to HR
        $this->logMockWhatsAppNotificationToHR($permit);

        return redirect()->route('welcome')
            ->with('success', 'Vehicle permit request submitted successfully! HR will be notified.');
    }

    /**
     * Display the specified resource.
     */
    public function show(VehiclePermit $permit)
    {
        $permit->load('employee');
        
        return Inertia::render('permits/show', [
            'permit' => $permit
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VehiclePermit $permit)
    {
        $permit->load('employee');
        
        return Inertia::render('permits/edit', [
            'permit' => $permit
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVehiclePermitRequest $request, VehiclePermit $permit)
    {
        $permit->update([
            'status' => $request->status,
            'hr_comments' => $request->hr_comments,
            'hr_action_at' => now(),
            'hr_action_by' => auth()->user()->name ?? 'HR Manager',
        ]);

        // Mock WhatsApp notification to employee
        $this->logMockWhatsAppNotificationToEmployee($permit);

        return redirect()->route('admin.hr')
            ->with('success', 'Permit ' . $request->status . ' successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VehiclePermit $permit)
    {
        $permit->delete();

        return redirect()->route('permits.index')
            ->with('success', 'Permit deleted successfully.');
    }



    /**
     * Mock WhatsApp notification to HR.
     */
    protected function logMockWhatsAppNotificationToHR(VehiclePermit $permit)
    {
        // This is a mock implementation
        // In a real application, you would integrate with WhatsApp Business API
        
        $message = "🚗 New Vehicle Permit Request\n\n";
        $message .= "Employee: {$permit->employee->name} ({$permit->employee->employee_id})\n";
        $message .= "Vehicle: {$permit->vehicle_type} - {$permit->license_plate}\n";
        $message .= "Duration: " . $permit->usage_start->format('M j, Y H:i') . " - " . $permit->usage_end->format('M j, Y H:i') . "\n";
        $message .= "Purpose: {$permit->purpose}\n\n";
        $message .= "Review: " . route('admin.hr');

        // Log the mock notification
        \Log::info('Mock WhatsApp to HR: ' . $message);
    }

    /**
     * Mock WhatsApp notification to employee.
     */
    protected function logMockWhatsAppNotificationToEmployee(VehiclePermit $permit)
    {
        // This is a mock implementation
        // In a real application, you would integrate with WhatsApp Business API
        
        $statusEmoji = $permit->status === 'approved' ? '✅' : '❌';
        $message = "{$statusEmoji} Vehicle Permit Update\n\n";
        $message .= "Hello {$permit->employee->name},\n\n";
        $message .= "Your vehicle permit request has been {$permit->status}.\n";
        $message .= "Vehicle: {$permit->vehicle_type} - {$permit->license_plate}\n";
        $message .= "Duration: " . $permit->usage_start->format('M j, Y H:i') . " - " . $permit->usage_end->format('M j, Y H:i') . "\n";
        
        if ($permit->hr_comments) {
            $message .= "HR Comments: {$permit->hr_comments}\n";
        }

        // Log the mock notification
        \Log::info('Mock WhatsApp to Employee: ' . $message);
    }
}