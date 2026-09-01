<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ticket_id',
        'user_id',
        'body',
        'role',
    ];

    /**
     * Get the ticket that owns the message.
     */
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * Get the user that owns the message.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}