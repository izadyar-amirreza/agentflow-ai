<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Workspace;
use App\Models\Ticket;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create a dummy workspace
        $workspace = Workspace::create([
            'name' => 'Main Support Team',
            'slug' => 'main-support',
        ]);

        // 2. Create an admin user for testing
        $user = User::factory()->create([
            'name' => 'Amirreza Izadyar',
            'email' => 'admin@agentflow.com',
            'password' => bcrypt('password'), // default password
            'workspace_id' => $workspace->id,
        ]);

        // 3. Create a sample ticket to test the AI chat
        Ticket::create([
            'workspace_id' => $workspace->id,
            'user_id' => $user->id,
            'subject' => 'System login issue',
            'status' => 'open',
        ]);
    }
}