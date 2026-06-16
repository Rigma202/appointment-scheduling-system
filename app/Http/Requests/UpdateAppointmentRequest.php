<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'duration' => 'required|in:15,30,45,60',
        ];
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
