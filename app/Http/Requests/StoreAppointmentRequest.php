<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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

            'appointment_date' => 'required|date',

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
            'appointment_date.required' =>'Please select an appointment date.',
            'appointment_date.date' =>'Please enter a valid appointment date.',
            'appointment_time.required' =>'Please select an appointment time.',
            'appointment_time.date_format' =>'Please enter a valid appointment time.',
            'duration.required' => 'Please select an appointment duration.',
            'duration.integer'  => 'Duration must be a valid number.',
            'duration.min'      => 'Duration must be greater than zero.',
        ];
    }
}
