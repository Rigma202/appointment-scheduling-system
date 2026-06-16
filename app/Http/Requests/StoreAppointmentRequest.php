<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;
class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'doctor_id' => 'required|exists:doctors,id',

            'patient_id' => 'required|exists:patients,id',

            'appointment_date' => 'required|date|after_or_equal:today',

            'appointment_time' => 'required|date_format:H:i',

            'duration' => 'required|in:15,30,45,60',
        ];
    }
    public function messages(): array
    {
        return [
        'doctor_id.required' => 'Please select a doctor.',
        'doctor_id.exists'   => 'The selected doctor is invalid.',
        'patient_id.required' => 'Please select a patient.',
        'patient_id.exists'   => 'The selected patient is invalid.',
        'appointment_date.required' => 'Please select an appointment date.',
        'appointment_date.date' => 'Please enter a valid appointment date.',
        'appointment_time.required' => 'Please select an appointment time.',
        'appointment_time.date_format' => 'Time format must be HH:MM.',
        'duration.required' => 'Please select duration.',
        'duration.in' => 'Invalid duration selected.',
        ];
    }
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {

        $start = Carbon::parse(
            $this->appointment_date . ' ' . $this->appointment_time
        );

        $end = $start->copy()->addMinutes((int) $this->duration);

        $opening = Carbon::parse($this->appointment_date . ' 09:15');
        $closing = Carbon::parse($this->appointment_date . ' 17:00');

        if ($start->lt($opening) || $end->gt($closing)) {
            $validator->errors()->add(
                'appointment_time',
                'Appointment must be within working hours (09:15 AM - 05:00 PM).'
            );
    }
        });
    }

}
