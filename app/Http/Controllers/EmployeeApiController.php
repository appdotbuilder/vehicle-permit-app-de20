<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeApiController extends Controller
{
    /**
     * Get employee details by employee ID.
     */
    public function show(Request $request)
    {
        $employee = Employee::where('employee_id', $request->employee_id)->first();
        
        if (!$employee) {
            return response()->json(['error' => 'Employee not found'], 404);
        }

        return response()->json([
            'name' => $employee->name,
            'department' => $employee->department,
            'grade' => $employee->grade,
        ]);
    }
}