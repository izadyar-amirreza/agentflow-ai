<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Ticket;

// Authenticate the private channel for tickets
Broadcast::channel('ticket.{ticketId}', function ($user, $ticketId) {
    // Admins can listen to any ticket
    if ($user->isAdmin()) {
        return true;
    }

    // Normal users can only listen to their own tickets
    $ticket = Ticket::find($ticketId);
    return $ticket && $ticket->user_id === $user->id;
});