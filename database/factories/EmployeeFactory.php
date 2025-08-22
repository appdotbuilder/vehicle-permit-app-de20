<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => 'EMP' . $this->faker->unique()->numberBetween(1000, 9999),
            'name' => $this->faker->name(),
            'department' => $this->faker->randomElement(['IT', 'HR', 'Finance', 'Operations', 'Marketing', 'Sales']),
            'grade' => $this->faker->randomElement(['Junior', 'Senior', 'Manager', 'Director']),
        ];
    }
}