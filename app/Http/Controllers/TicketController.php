<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TicketController extends Controller
{
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

        // 1. Save the user's message
        $ticket->messages()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
            'role' => 'user',
        ]);

        // 2. Prepare conversation history for the AI
        $conversation = $ticket->messages()->orderBy('created_at', 'asc')->get()->map(function ($msg) {
            return [
                'role' => $msg->role,
                'content' => $msg->body,
            ];
        })->toArray();

        // Insert system prompt at the beginning
        array_unshift($conversation, [
            'role' => 'system',
            'content' => 'You are a helpful and professional IT support assistant.'
        ]);

        // 3. Call Groq API with specific max_tokens to prevent 429 Rate Limit error
        $response = Http::withToken(env('GROQ_API_KEY'))
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'qwen/qwen3.8-27b', 
                'messages' => $conversation,
                'max_tokens' => 800, // <--- This line prevents the rate limit error
            ]);

        // 4. Save the AI's response if successful
        if ($response->successful()) {
            $aiText = $response->json('choices.0.message.content');
            
            $ticket->messages()->create([
                'user_id' => null,
                'body' => $aiText,
                'role' => 'assistant',
            ]);
        }

        // Reload the page to show new messages
        return back();
    }
}