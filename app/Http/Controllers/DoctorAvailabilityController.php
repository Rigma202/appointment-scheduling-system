<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Services\DoctorAvailabilityService;
use Illuminate\Http\Request;

class DoctorAvailabilityController extends Controller
{
    public function availableSlots(Request $request,Doctor $doctor,DoctorAvailabilityService $service)
    {

        $request->validate(['date' => 'required|date']);

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Doctor not found'
            ], 404);
        }

        $slots = $service->getAvailableSlots(
            $doctor,
            $request->date
        );

        return response()->json([
            'success' => true,
            'doctor_id' => $doctor->id,
            'date' => $request->date,
            'data' => $slots
        ]);
    }
}
