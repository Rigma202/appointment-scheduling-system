<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AppointmentController;


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
    Route::resource('appointments', AppointmentController::class);
});

require __DIR__.'/auth.php';
