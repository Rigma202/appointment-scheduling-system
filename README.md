# Appointment Scheduling System

This is a Laravel 12 based Appointment Scheduling System for managing hospital appointments.

## Features

- Manage Departments, Doctors, and Patients
- Create, Edit, and Cancel Appointments
- System Prevent overlapping appointments
- View available doctor time slots
- API for fetching available slots
- Supports large dataset handling using factories and seeders

## Tech Stack

- Laravel 12
- PHP 8.2+
- MySQL
- React (Frontend)

## Installation

```bash
git clone <repo-url>
cd <project-folder>

composer install
npm install

cp .env.example .env
php artisan key:generate

php artisan migrate --seed

php artisan serve
npm run dev
