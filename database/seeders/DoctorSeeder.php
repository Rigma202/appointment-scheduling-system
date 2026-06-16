<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Doctor;
class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = Department::all();

        if ($departments->isEmpty()) {
            $departments = Department::factory(5)->create();
        }

        $departments->each(function (Department $department) {
            Doctor::factory(3)->create([
                'department_id' => $department->id,
            ]);
        });
    }
}
