<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

// ShouldBroadcastNow ensures the message is sent instantly
class MessageSent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $message;

    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    public function broadcastOn(): array
    {
        // Broadcast on a private channel specific to this ticket
        return [
            new PrivateChannel('ticket.' . $this->message->ticket_id),
        ];
    }

    public function broadcastWith(): array
    {
        // Load the user relation so the frontend has the sender's details
        $this->message->load('user');
        
        return [
            'message' => $this->message->toArray(),
        ];
    }
}