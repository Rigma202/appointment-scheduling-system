<?php

namespace App\Http\Controllers;

use App\Services\AppointmentService;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use Illuminate\Http\Request;


class AppointmentController extends Controller
{
    protected $appointmentService;

    public function __construct(AppointmentService $appointmentService)
    {
        $this->appointmentService = $appointmentService;
    }

    public function index()
    {
        return view('appointment.index', [
            'appointments' => $this->appointmentService->getAll(),
            'doctors' => $this->appointmentService->getDoctors(),
            'patients' => $this->appointmentService->getPatients(),
            'departments' => $this->appointmentService->getDepartments(),
        ]);
    }

    public function create()
    {
        return view('appointment.create', [
            'doctors' => $this->appointmentService->getDoctors(),
            'patients' => $this->appointmentService->getPatients(),
            'departments' => $this->appointmentService->getDepartments()
        ]);
    }
    public function availability()
    {
        return view('doctors.availability', [
            'doctors' => $this->appointmentService->getDoctors(),
        ]);
    }

    public function search(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'date' => 'required|date',
        ]);

        $appointments = $this->appointmentService
            ->appointmentsForDoctorOnDate($validated['doctor_id'], $validated['date']);

        return response()->json([
            'success' => true,
            'data' => $appointments->map(fn ($a) => [
                'id' => $a->id,
                'time' => $a->appointment_time->format('h:i A'),
                'patient' => $a->patient->name ?? '',
                'duration' => $a->duration,
                'status' => $a->status,
            ])->values(),
        ]);
    }

    public function store(StoreAppointmentRequest $request)
    {
        $result = $this->appointmentService
            ->create($request->validated());

        if (!$result['success']) {

            return response()->json($result, 409);
        }

        return response()->json($result);
    }

    public function show(int $id)
    {
        $appointment = $this->appointmentService->find($id);

        return view('appointment.show', compact('appointment'));
    }

    public function edit(int $id)
    {
        return view('appointment.edit', [
            'appointment' => $this->appointmentService->find($id),
            'doctors' => $this->appointmentService->getDoctors(),
            'patients' => $this->appointmentService->getPatients(),
            'departments' => $this->appointmentService->getDepartments()
        ]);
    }

    public function update(UpdateAppointmentRequest $request,int $id)
    {
        $result = $this->appointmentService->update($id, $request->validated());

        if (!$result['success']) {
            return response()->json($result, 409);
        }

        return response()->json($result);
    }

    public function destroy(int $id)
    {
        $this->appointmentService->delete($id);

        return response()->json([
            'success' => true,
            'message' => 'Appointment deleted.'
        ]);
    }
}
