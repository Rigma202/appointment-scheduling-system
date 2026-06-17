<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\PatientController;


use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', [ProfileController::class,'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/appointments/availability',[AppointmentController::class, 'availability'])->name('appointments.availability');
    Route::get('/appointments-search', [AppointmentController::class, 'search'])->name('appointments.search');
    Route::resource('appointments', AppointmentController::class);
    Route::resource('doctors', DoctorController::class);
    Route::resource('patients', PatientController::class);
});

require __DIR__.'/auth.php';
