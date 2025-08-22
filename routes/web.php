<?php

use App\Http\Controllers\EmployeeApiController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\GeneralAdminController;
use App\Http\Controllers\HRAdminController;
use App\Http\Controllers\VehiclePermitController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

// Vehicle permit routes (public access for form submission)
Route::controller(VehiclePermitController::class)->group(function () {
    Route::post('/permits', 'store')->name('permits.store');
});

// Employee API routes
Route::get('/api/employees/{employee_id}', [EmployeeApiController::class, 'show'])->name('employees.details');

// Admin routes (require authentication)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Admin routes
    Route::get('/admin/hr', [HRAdminController::class, 'index'])->name('admin.hr');
    Route::get('/admin/general', [GeneralAdminController::class, 'index'])->name('admin.general');
    Route::post('/admin/export', [GeneralAdminController::class, 'store'])->name('admin.export');
    
    // Employee management routes
    Route::resource('employees', EmployeeController::class);
    
    // Permit management routes
    Route::resource('permits', VehiclePermitController::class)->except(['store']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
