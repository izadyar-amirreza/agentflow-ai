<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

// 1. Add 'role' to the Fillable array
#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Get the workspace that owns the user
    public function workspace()
    {
        return $this->belongsTo(Workspace::class);
    }

    // Get the tickets created by the user
    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    // Get the messages sent by the user
    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    // 2. Helper method to check if the user is an admin
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}