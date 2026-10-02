<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\TicketController as AdminTicketController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Ticket and Chat routes (User Side)
    Route::get('/tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store'); 
    Route::get('/tickets/{ticket}', [TicketController::class, 'show'])->name('tickets.show');
    Route::post('/tickets/{ticket}/messages', [TicketController::class, 'storeMessage'])->name('tickets.messages.store');
});

// Admin Routes (Protected by 'auth', authorization happens in the controller)
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    
    // Path to list all tickets for the administrator
    Route::get('/tickets', [AdminTicketController::class, 'index'])->name('tickets.index');
    
    // Added: Admin paths for accessing tickets and sending blocking messages
    Route::get('/tickets/{ticket}', [AdminTicketController::class, 'show'])->name('tickets.show');
    Route::post('/tickets/{ticket}/messages', [AdminTicketController::class, 'storeMessage'])->name('tickets.messages.store');
    // New route for closing a ticket by the admin
    Route::post('/tickets/{ticket}/close', [AdminTicketController::class, 'close'])->name('tickets.close');
    
});

require __DIR__.'/auth.php';