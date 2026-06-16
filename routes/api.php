<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\DoctorAvailabilityController;

Route::get('/doctors/{doctor}/available-slots', [DoctorAvailabilityController::class, 'availableSlots']);
