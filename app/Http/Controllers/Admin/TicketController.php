<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TicketController extends Controller
{
    public function index()
    {
        
        // Retrieve all tickets along with the username of the creator (sorted by newest)
        $tickets = Ticket::with('user')->latest()->get();

        // Send data to admin page
        return Inertia::render('Admin/Tickets/Index', [
            'tickets' => $tickets
        ]);
    }
}