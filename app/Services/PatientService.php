<?php

namespace App\Services;

use App\Models\Patient;

class PatientService
{
    public function all()
    {
        return Patient::latest()->get();
    }

    public function store(array $data)
    {
        return Patient::create($data);
    }

    public function update(Patient $patient, array $data)
    {
        $patient->update($data);
        return $patient;
    }

    public function delete(Patient $patient)
    {
        return $patient->delete();
    }

    public function find($id)
    {
        return Patient::findOrFail($id);
    }
}
