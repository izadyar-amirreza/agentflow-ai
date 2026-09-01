<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Message;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    // Store a new message in a ticket and handle AI response
    public function storeMessage(Request $request, Ticket $ticket)
    {
        // 1. Validate the incoming message
        $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        // 2. Save the user's message
        $userMessage = Message::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'body' => $request->body,
            'role' => 'user',
        ]);

        // 3. TODO: Call your AI Service (Groq / Llama 3) here to generate a response
        // $aiResponseText = app(\App\Services\AiService::class)->generateResponse($request->body);

        // 4. Save the AI response (example)
        /*
        Message::create([
            'ticket_id' => $ticket->id,
            'user_id' => null, // or AI bot user id
            'body' => $aiResponseText,
            'role' => 'assistant',
        ]);
        */

        return back()->with('success', 'Message sent successfully.');
    }

    public function show(Ticket $ticket)
    {
        // Load all messages for this ticket
        $ticket->load('messages');

        // Send data to the React view via Inertia
        return inertia('Tickets/Show', [
            'ticket' => $ticket,
            'messages' => $ticket->messages
        ]);
    }

}