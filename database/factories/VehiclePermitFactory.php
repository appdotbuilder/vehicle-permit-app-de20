<?php

namespace Database\Factories;

use App\Models\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VehiclePermit>
 */
class VehiclePermitFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('+1 day', '+1 month');
        $endDate = $this->faker->dateTimeBetween($startDate, $startDate->format('Y-m-d') . ' +7 days');

        return [
            'employee_id' => Employee::factory(),
            'vehicle_type' => $this->faker->randomElement(['Sedan', 'SUV', 'Van', 'Truck', 'Motorcycle']),
            'license_plate' => strtoupper($this->faker->lexify('???')) . '-' . $this->faker->numberBetween(1000, 9999),
            'usage_start' => $startDate,
            'usage_end' => $endDate,
            'purpose' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(['pending', 'approved', 'rejected']),
        ];
    }

    /**
     * Indicate that the permit is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the permit is approved.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'hr_action_at' => now(),
            'hr_action_by' => 'HR Manager',
        ]);
    }

    /**
     * Indicate that the permit is rejected.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'hr_action_at' => now(),
            'hr_action_by' => 'HR Manager',
            'hr_comments' => $this->faker->sentence(),
        ]);
    }
}