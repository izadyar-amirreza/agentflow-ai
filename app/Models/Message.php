<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    // Get the ticket that owns the message
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    // Get the user who sent the message
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
