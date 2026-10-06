<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        // Security check: Ensure the user is an admin
        if (!auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        // Fetch all tickets in the system, along with the user who created them
        $tickets = Ticket::with('user')->latest()->get();

        return inertia('Admin/Tickets/Index', [
            'tickets' => $tickets
        ]);
    }

    public function show(Ticket $ticket)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        // Load messages and the ticket owner's details
        $ticket->load(['messages', 'user']);

        return inertia('Admin/Tickets/Show', [
            'ticket' => $ticket,
            'messages' => $ticket->messages
        ]);
    }

    public function storeMessage(Request $request, Ticket $ticket)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $request->validate([
            'body' => 'required|string|max:2000',
            'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,txt,log,zip,rar|max:5120',
        ]);

        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('attachments', 'public');
        }

        $ticket->messages()->create([
            'user_id' => auth()->id(),
            'body' => $request->body,
            'role' => 'assistant',
            'attachment' => $attachmentPath, // ذخیره مسیر فایل
        ]);

        return back();
    }

    public function close(Ticket $ticket)
    {
        if (!auth()->user()->isAdmin()) {
            abort(403);
        }

        $ticket->update([
            'status' => 'closed'
        ]);

        return back();
    }

}