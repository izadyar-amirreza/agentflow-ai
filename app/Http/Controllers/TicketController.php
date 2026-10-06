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
            'status' => 'open',
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
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,txt,log,zip,rar|max:5120',
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('attachments', 'public');
        }

        // 1. Save the message and store it in $msg variable
        $msg = $ticket->messages()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
            'role' => auth()->user()->isAdmin() ? 'assistant' : 'user',
            'attachment' => $attachmentPath,
        ]);

        // Dispatch the real-time event for user message
        event(new \App\Events\MessageSent($msg));

        // 2. Check for Human Takeover
        $adminHasReplied = $ticket->messages()->whereHas('user', function ($query) {
            $query->where('role', 'admin');
        })->exists();

        if ($adminHasReplied) {
            return back();
        }

        // 3. Prepare the conversation history for the AI
        $conversation = $ticket->messages()->orderBy('created_at', 'asc')->get()->map(function ($m) {
            return [
                'role' => $m->role,
                'content' => $m->body,
            ];
        })->toArray();

        array_unshift($conversation, [
            'role' => 'system',
            'content' => 'You are a helpful and professional IT support assistant.'
        ]);

        // 4. Send the request to the Groq API
        $response = \Illuminate\Support\Facades\Http::withToken(env('GROQ_API_KEY'))
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => env('GROQ_MODEL', 'qwen/qwen3.8-27b'), 
                'messages' => $conversation,
                'max_tokens' => 800,
            ]);

        // 5. Save the AI's response
        if ($response->successful()) {
            $aiText = $response->json('choices.0.message.content');
            
            $aiMsg = $ticket->messages()->create([
                'user_id' => null,
                'body' => $aiText,
                'role' => 'assistant',
            ]);

            // Dispatch the real-time event for AI message
            event(new \App\Events\MessageSent($aiMsg));
        }

        return back();
    }
}