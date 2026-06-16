<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Doctor;
use App\Models\Department;
/**
 * @extends Factory<Doctor>
 */
class DoctorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'department_id' => Department::factory(),
            'name' => 'Dr. ' . $this->faker->name(),
            'phone' => $this->faker->numerify('9#########'),
            'email' => $this->faker->unique()->safeEmail(),
        ];
    }
}
