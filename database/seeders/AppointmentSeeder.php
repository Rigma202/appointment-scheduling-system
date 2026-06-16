<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Appointment;



class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $doctors  = Doctor::all();
        $patients = Patient::all();

        $doctors->each(function (Doctor $doctor) use ($patients) {
            Appointment::factory(2)->create([
                'doctor_id'  => $doctor->id,
                'patient_id' => $patients->random()->id,
            ]);
        });
    }
}
