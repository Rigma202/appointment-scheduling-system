<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DoctorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $doctorId = $this->route('doctor')?->id;

        return [
            'department_id' => 'required|exists:departments,id',
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:10',
            'email' => 'required|email|unique:doctors,email,' . $doctorId,
        ];
    }

    public function messages(): array
    {
        return [
            'department_id.required' => 'Please select a department.',
            'department_id.exists' => 'Selected department is invalid.',

            'name.required' => 'Doctor name is required.',
            'name.string' => 'Doctor name must be a valid text.',
            'name.max' => 'Doctor name cannot exceed 255 characters.',

            'phone.required' => 'Phone number is required.',
            'phone.max' => 'Phone number cannot exceed 10 characters.',

            'email.required' => 'Email is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already taken by another doctor.',
        ];
    }
}
