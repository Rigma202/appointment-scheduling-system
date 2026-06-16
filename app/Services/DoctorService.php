<?php

namespace App\Services;

use App\Models\Doctor;

class DoctorService
{
    public function all()
    {
        return Doctor::with('department')->latest()->get();
    }

    public function store(array $data)
    {
        return Doctor::create($data);
    }

    public function update(Doctor $doctor, array $data)
    {
        $doctor->update($data);
        return $doctor;
    }

    public function delete(Doctor $doctor)
    {
        return $doctor->delete();
    }

    public function find($id)
    {
        return Doctor::findOrFail($id);
    }
}
