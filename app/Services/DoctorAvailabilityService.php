<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Doctor;
use Carbon\Carbon;

class DoctorAvailabilityService
{
    public function getAvailableSlots(Doctor $doctor, string $date): array
    {
        $startTime = Carbon::parse($date . ' 09:15');
        $endTime   = Carbon::parse($date . ' 16:00');


        $appointments = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('appointment_time', $date)
            ->where('status', '!=', 'cancelled')
            ->get(['appointment_time', 'duration']);

        $busySlots = [];

        foreach ($appointments as $appointment) {

            $start = Carbon::parse($appointment->appointment_time);
            $end   = $start->copy()->addMinutes((int) $appointment->duration);

            while ($start < $end) {
                $busySlots[$start->format('H:i')] = true;
                $start->addMinutes(15);
            }
        }


        $slots = [];

        $cursor = $startTime->copy();

        while ($cursor <= $endTime) {

            $time = $cursor->format('H:i');

            if (!isset($busySlots[$time])) {
                $slots[] = $time;
            }

            $cursor->addMinutes(15);
        }

        return $slots;
    }
}
