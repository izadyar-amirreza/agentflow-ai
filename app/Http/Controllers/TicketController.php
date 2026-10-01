<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TicketController extends Controller
{
    public function index()
    {
        // Sends the user's list of tickets to the frontend 
        return inertia('Tickets/Index', [
            'tickets' => auth()->user()->tickets()->latest()->get()
        ]);
    }

    // ADDED: Method to handle the creation of a new ticket from the UI form
    public function store(Request $request)
    {
        // Validate the ticket subject
        $request->validate(['subject' => 'required|string|max:255']);
        
        // Create the new ticket in the database
        $ticket = auth()->user()->tickets()->create([
            'subject' => $request->subject,
        ]);

        // Redirect the user to the chat page of the newly created ticket
        return redirect()->route('tickets.show', $ticket);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load('messages');

        return inertia('Tickets/Show', [
            'ticket' => $ticket,
            'messages' => $ticket->messages
        ]);
    }

    public function storeMessage(Request $request, Ticket $ticket)
    {
        $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        // 1. Save the message
        // If the sender is an admin, set their role as 'assistant' to maintain system consistency
        $ticket->messages()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
            'role' => auth()->user()->isAdmin() ? 'assistant' : 'user',
        ]);

        // 2. Check for Human Takeover
        // If an admin has sent at least one message in this ticket, stop the AI bot
        $adminHasReplied = $ticket->messages()->whereHas('user', function ($query) {
            $query->where('role', 'admin');
        })->exists();

        if ($adminHasReplied) {
            return back(); // Exit the function and do not send a request to the AI
        }

        // 3. Prepare the conversation history for the AI
        $conversation = $ticket->messages()->orderBy('created_at', 'asc')->get()->map(function ($msg) {
            return [
                'role' => $msg->role,
                'content' => $msg->body,
            ];
        })->toArray();

        // Insert the system prompt at the beginning of the array
        array_unshift($conversation, [
            'role' => 'system',
            'content' => 'You are a helpful and professional IT support assistant.'
        ]);

        // 4. Send the request to the Groq API
        $response = Http::withToken(env('GROQ_API_KEY'))
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                // Updated default model to the working Qwen model
                'model' => env('GROQ_MODEL', 'qwen/qwen3.8-27b'), 
                'messages' => $conversation,
                'max_tokens' => 800,
            ]);

        // 5. Save the AI's response
        if ($response->successful()) {
            $aiText = $response->json('choices.0.message.content');
            
            $ticket->messages()->create([
                'user_id' => null,
                'body' => $aiText,
                'role' => 'assistant',
            ]);
        }

        return back();
    }
}