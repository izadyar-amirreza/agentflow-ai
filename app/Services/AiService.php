<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AiService
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = config('services.groq.key', env('GROQ_API_KEY', ''));
        $this->baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
        $this->model = config('services.groq.model', env('GROQ_MODEL', 'llama-3.3-70b-versatile'));
    }

    /**
     * Generate an AI response based on ticket context and user prompt.
     *
     * @param string $prompt
     * @param string $systemPrompt
     * @return string|null
     */
    public function generateResponse(string $prompt, string $systemPrompt = 'You are a helpful customer support AI assistant.'): ?string
    {
        try {
            $response = Http::withToken($this->apiKey)
                ->timeout(30)
                ->post($this->baseUrl, [
                    'model' => $this->model,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => $systemPrompt,
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt,
                        ],
                    ],
                    'temperature' => 0.6,
                    'max_tokens' => 1024,
                ]);

            if ($response->successful()) {
                return $response->json('choices.0.message.content');
            }

            Log::error('Groq API Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('AiService Exception: ' . $e->getMessage());
            return null;
        }
    }
}