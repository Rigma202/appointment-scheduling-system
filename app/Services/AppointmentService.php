<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Department;
use Carbon\Carbon;
class AppointmentService
{
    public function getPaginated()
    {
        return Appointment::with([
            'doctor.department',
            'patient'
        ])
        ->latest()
        ->paginate(10);
    }

    public function create(array $data): array
    {
        $appointmentDateTime = Carbon::parse(
            $data['appointment_date'].' '.$data['appointment_time']
        );

        $conflict = $this->checkConflicts(
            $data['doctor_id'],
            $data['patient_id'],
            $appointmentDateTime,
            $data['duration']
        );

        if (!$conflict['success']) {
            return $conflict;
        }

        $appointment = Appointment::create([
            'doctor_id' => $data['doctor_id'],
            'patient_id' => $data['patient_id'],
            'appointment_time' => $appointmentDateTime,
            'duration' => $data['duration'],
            'status' => 'scheduled',
        ]);

        return [
            'success' => true,
            'message' => 'Appointment created successfully.',
            'data' => $appointment,
        ];
    }

    private function checkConflicts(int $doctorId,int $patientId, Carbon $startTime, int $duration,?int $ignoreAppointmentId = null): array
    {

        $endTime = $startTime->copy()->addMinutes($duration);

        $doctorConflict = Appointment::where('doctor_id', $doctorId)
            ->where('status', '!=', 'cancelled')
            ->when($ignoreAppointmentId, function ($query) use ($ignoreAppointmentId) {
                $query->where('id', '!=', $ignoreAppointmentId);
            })
            ->where('appointment_time', '<', $endTime)
            ->whereRaw(
                "DATE_ADD(appointment_time, INTERVAL duration MINUTE) > ?",
                [$startTime]
            )
            ->get();

        if ($doctorConflict->count()) {

            $bookings = $doctorConflict->map(function ($appointment) {

                return [
                    'time' => Carbon::parse($appointment->appointment_time)
                        ->format('d-m-Y h:i A'),
                    'duration' => $appointment->duration.' Minutes',
                ];
            });

            return [
                'success' => false,
                'type' => 'doctor_conflict',
                'message' => 'Doctor already has appointments during this time.',
                'bookings' => $bookings,
            ];
        }

        $patientConflict = Appointment::where('patient_id', $patientId)
            ->where('status', '!=', 'cancelled')
            ->when($ignoreAppointmentId, function ($query) use ($ignoreAppointmentId) {
                $query->where('id', '!=', $ignoreAppointmentId);
            })
            ->where('appointment_time', '<', $endTime)
            ->whereRaw(
                "DATE_ADD(appointment_time, INTERVAL duration MINUTE) > ?",
                [$startTime]
            )
            ->get();

        if ($patientConflict->count()) {

            return [
                'success' => false,
                'type' => 'patient_conflict',
                'message' => 'Patient already has an appointment during this time.',
            ];
        }

        return [
            'success' => true,
        ];
    }

    public function find(int $id)
    {
        return Appointment::with([
            'doctor.department',
            'patient'
        ])->findOrFail($id);
    }

    public function update(int $id, array $data): array
    {
        $appointment = Appointment::findOrFail($id);

        $appointmentDateTime = Carbon::parse(
            $data['appointment_date'].' '.$data['appointment_time']
        );

        $conflict = $this->checkConflicts(
            $data['doctor_id'],
            $data['patient_id'],
            $appointmentDateTime,
            $data['duration'],
            $id
        );

        if (!$conflict['success']) {
            return $conflict;
        }

        $appointment->update([
            'doctor_id' => $data['doctor_id'],
            'patient_id' => $data['patient_id'],
            'appointment_time' => $appointmentDateTime,
            'duration' => $data['duration'],
        ]);

        return [
            'success' => true,
            'message' => 'Appointment updated successfully.',
        ];
    }
    public function delete(int $id)
    {
        return Appointment::findOrFail($id)->delete();
    }

    public function getDoctors()
    {
        return Doctor::orderBy('name')->get();
    }

    public function getPatients()
    {
        return Patient::orderBy('name')->get();
    }

    public function getDepartments()
    {
        return Department::orderBy('name')->get();
    }
}
