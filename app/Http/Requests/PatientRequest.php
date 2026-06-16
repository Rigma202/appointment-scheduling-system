<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $patientId = $this->route('patient')?->id;

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:patients,email,' . $patientId,
            'phone' => 'required|string|max:10',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Patient name is required.',
            'name.string'   => 'Patient name must be a valid string.',
            'name.max'      => 'Patient name must not exceed 255 characters.',

            'email.required' => 'Email address is required.',
            'email.email'     => 'Please enter a valid email address.',
            'email.unique'    => 'This email is already registered.',

            'phone.required' => 'Phone number is required.',
            'phone.string'   => 'Phone number must be a valid string.',
            'phone.max'      => 'Phone number must not exceed 10 characters.',
        ];
    }
}
