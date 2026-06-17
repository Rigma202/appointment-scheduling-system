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

    /**
     * All appointments for the listing table (paginated client-side), most recent first.
     */
    public function getAll()
    {
        return Appointment::with([
            'doctor.department',
            'patient'
        ])
        ->orderByDesc('appointment_time')
        ->get();
    }

    /**
     * The nearest upcoming (future, non-cancelled) appointments, soonest first.
     */
    public function getUpcoming(int $limit = 5)
    {
        return Appointment::with([
            'doctor.department',
            'patient'
        ])
        ->where('appointment_time', '>=', now())
        ->where('status', '!=', 'cancelled')
        ->orderBy('appointment_time')
        ->limit($limit)
        ->get();
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

        $doctorConflict = $this->overlappingAppointments($startTime, $endTime, $ignoreAppointmentId)
            ->where('doctor_id', $doctorId)
            ->get(['appointment_time', 'duration']);

        if ($doctorConflict->isNotEmpty()) {

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

        $patientHasConflict = $this->overlappingAppointments($startTime, $endTime, $ignoreAppointmentId)
            ->where('patient_id', $patientId)
            ->exists();

        if ($patientHasConflict) {

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

    /**
     * Base query for non-cancelled appointments that overlap the given window:
     * existing.start < new.end AND existing.end > new.start.
     */
    private function overlappingAppointments(Carbon $startTime, Carbon $endTime, ?int $ignoreAppointmentId)
    {
        return Appointment::where('status', '!=', 'cancelled')
            ->where('appointment_time', '<', $endTime)
            ->whereRaw('DATE_ADD(appointment_time, INTERVAL duration MINUTE) > ?', [$startTime])
            ->when($ignoreAppointmentId, function ($query) use ($ignoreAppointmentId) {
                $query->where('id', '!=', $ignoreAppointmentId);
            });
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

    /**
     * Aggregate counts for the admin dashboard.
     */
    public function dashboardStats(): array
    {
        $weekCount = Appointment::whereBetween('appointment_time', [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ])->count();

        $scheduledCount = Appointment::where('status', 'scheduled')->count();
        $cancelledCount = Appointment::where('status', 'cancelled')->count();

        // Busiest / quietest doctor among those who actually have appointments.
        $doctors = Doctor::withCount('appointments')
            ->having('appointments_count', '>', 0)
            ->get();

        $most = $doctors->sortByDesc('appointments_count')->first();
        $least = $doctors->sortBy('appointments_count')->first();

        $summary = fn ($doctor) => $doctor
            ? ['name' => $doctor->name, 'count' => $doctor->appointments_count]
            : null;

        return [
            'week' => $weekCount,
            'scheduled' => $scheduledCount,
            'cancelled' => $cancelledCount,
            'most' => $summary($most),
            'least' => $summary($least),
        ];
    }

    /**
     * All appointments for a doctor on a given date, soonest first.
     */
    public function appointmentsForDoctorOnDate(int $doctorId, string $date)
    {
        return Appointment::with('patient')
            ->where('doctor_id', $doctorId)
            ->whereDate('appointment_time', $date)
            ->orderBy('appointment_time')
            ->get();
    }

    public function getDoctors()
    {
        // Eager-load department: the availability view reads $doctor->department->name.
        return Doctor::with('department')->orderBy('name')->get();
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
