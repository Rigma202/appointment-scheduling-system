<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class UpdateAppointmentRequest extends FormRequest
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

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {

            if (! $this->appointment_date || ! $this->appointment_time) {
                return;
            }

            $start = Carbon::parse($this->appointment_date . ' ' . $this->appointment_time);
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

    public function messages(): array
    {
        return [
            'doctor_id.required' => 'Please select a doctor.',
            'doctor_id.exists' => 'Selected doctor is invalid.',

            'patient_id.required' => 'Please select a patient.',
            'patient_id.exists' => 'Selected patient is invalid.',

            'appointment_date.required' => 'Appointment date is required.',
            'appointment_date.date' => 'Please enter a valid date.',

            'appointment_time.required' => 'Appointment time is required.',

            'duration.required' => 'Please select appointment duration.',
            'duration.in' => 'Invalid appointment duration selected.',
        ];
    }
}
