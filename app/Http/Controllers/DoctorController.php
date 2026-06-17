<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\Department;
use App\Http\Requests\DoctorRequest;
use App\Services\DoctorService;

class DoctorController extends Controller
{
    public function __construct(private DoctorService $service) {}

    public function index()
    {
        $doctors = $this->service->all();
        $departments = Department::all();

        return view('doctors.index', compact('doctors', 'departments'));
    }

    public function store(DoctorRequest $request)
    {
        $this->service->store($request->validated());

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Doctor created successfully']);
        }

        return redirect()->back()->with('success', 'Doctor created successfully');
    }

    public function edit(Doctor $doctor)
    {
        $departments = Department::all();
        return view('doctors.edit', compact('doctor', 'departments'));
    }

    public function update(DoctorRequest $request, Doctor $doctor)
    {
        $this->service->update($doctor, $request->validated());

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Doctor updated successfully']);
        }

        return redirect()->route('doctors.index');
    }

    public function destroy(Doctor $doctor)
    {
        $this->service->delete($doctor);

        if (request()->expectsJson()) {
            return response()->json(['success' => true, 'message' => 'Doctor deleted successfully']);
        }

        return redirect()->back();
    }
}
