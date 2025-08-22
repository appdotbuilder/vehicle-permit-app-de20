<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\VehiclePermit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample employees
        $employees = [
            [
                'employee_id' => 'EMP001',
                'name' => 'John Smith',
                'department' => 'IT',
                'grade' => 'Senior',
            ],
            [
                'employee_id' => 'EMP002',
                'name' => 'Sarah Johnson',
                'department' => 'HR',
                'grade' => 'Manager',
            ],
            [
                'employee_id' => 'EMP003',
                'name' => 'Michael Brown',
                'department' => 'Finance',
                'grade' => 'Junior',
            ],
            [
                'employee_id' => 'EMP004',
                'name' => 'Emily Davis',
                'department' => 'Operations',
                'grade' => 'Senior',
            ],
            [
                'employee_id' => 'EMP005',
                'name' => 'David Wilson',
                'department' => 'Marketing',
                'grade' => 'Director',
            ],
        ];

        foreach ($employees as $employeeData) {
            $employee = Employee::create($employeeData);
            
            // Create some sample permits for each employee
            VehiclePermit::factory()
                ->count(random_int(1, 3))
                ->for($employee)
                ->create();
        }

        // Create additional random employees with permits
        Employee::factory()
            ->count(10)
            ->has(VehiclePermit::factory()->count(random_int(0, 2)))
            ->create();
    }
}