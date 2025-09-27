<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConversacionAgente extends Model
{
    use HasFactory;

    protected $table = 'conversaciones_agente';

    protected $fillable = [
        'user_id',
        'session_id',
        'query',
        'response',
        'context',
        'status',
        'error_message',
        'response_time'
    ];

    protected $casts = [
        'context' => 'array',
        'response' => 'array',
        'response_time' => 'integer'
    ];

    protected $attributes = [
        'status' => 'pending'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeBySession($query, $sessionId)
    {
        return $query->where('session_id', $sessionId);
    }

    public function scopeRecent($query, $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    public function markAsCompleted(array $response, int $responseTime = null): self
    {
        $this->update([
            'response' => $response,
            'status' => 'completed',
            'response_time' => $responseTime
        ]);

        return $this;
    }

    public function markAsFailed(string $errorMessage): self
    {
        $this->update([
            'status' => 'failed',
            'error_message' => $errorMessage
        ]);

        return $this;
    }

    public function getFormattedResponseAttribute(): ?string
    {
        if (!$this->response || !is_array($this->response)) {
            return null;
        }

        return $this->response['message'] ?? null;
    }

    public function hasData(): bool
    {
        return isset($this->response['data']) && !empty($this->response['data']);
    }

    public function needsClarification(): bool
    {
        return isset($this->response['clarification']['needs_clarification']) &&
               $this->response['clarification']['needs_clarification'] === true;
    }

    public function getClarificationQuestion(): ?string
    {
        return $this->response['clarification']['question'] ?? null;
    }
}