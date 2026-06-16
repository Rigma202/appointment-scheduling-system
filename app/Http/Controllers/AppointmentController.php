<?php

namespace App\Http\Controllers;

use App\Services\AppointmentService;
use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;


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
            'appointments' => $this->appointmentService->getPaginated(),
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
