<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'doctor_id'        => Doctor::factory(),
            'patient_id'       => Patient::factory(),
            'appointment_time' => fake()->dateTimeBetween('now', '+3 months'),
            'duration'         => fake()->randomElement([15, 30, 45, 60]),
            'status'           => fake()->randomElement(['scheduled', 'completed', 'cancelled']),
        ];
    }
}
