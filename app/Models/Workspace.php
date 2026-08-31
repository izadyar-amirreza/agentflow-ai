<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Workspace extends Model
{
    // Get the users associated with the workspace
    public function users()
    {
        return $this->hasMany(User::class);
    }

    // Get the tickets associated with the workspace
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
