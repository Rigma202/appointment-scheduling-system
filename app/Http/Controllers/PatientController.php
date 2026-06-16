<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Http\Requests\PatientRequest;
use App\Services\PatientService;

class PatientController extends Controller
{
    public function __construct(private PatientService $service) {}

    public function index()
    {
        $patients = $this->service->all();
        return view('patient.index', compact('patients'));
    }

    public function store(PatientRequest $request)
    {
        $this->service->store($request->validated());
        return redirect()->back();
    }

    public function edit(Patient $patient)
    {
        return view('patient.edit', compact('patient'));
    }

    public function update(PatientRequest $request, Patient $patient)
    {
        $this->service->update($patient, $request->validated());
        return redirect()->route('patients.index');
    }

    public function destroy(Patient $patient)
    {
        $this->service->delete($patient);
        return redirect()->back();
    }
}
