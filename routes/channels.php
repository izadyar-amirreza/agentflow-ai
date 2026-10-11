<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Ticket;

Broadcast::channel('ticket.{id}', function ($user, $id) {
    // If the user is an admin, allow access immediately
    // Assuming your admin column is named 'is_admin'. If it's named 'role', change this to $user->role === 'admin'.
    if ($user->is_admin) {
        return true;
    }

    // If not an admin, check if the user is the owner of the ticket
    $ticket = Ticket::find($id);
    return $ticket && $ticket->user_id === $user->id;
});