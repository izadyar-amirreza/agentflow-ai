<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    // Get the workspace that owns the ticket
    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    // Get the user who created the ticket
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Get the messages associated with the ticket
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
