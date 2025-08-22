<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\VehiclePermit
 *
 * @property int $id
 * @property int $employee_id
 * @property string $vehicle_type
 * @property string $license_plate
 * @property \Illuminate\Support\Carbon $usage_start
 * @property \Illuminate\Support\Carbon $usage_end
 * @property string|null $purpose
 * @property string $status
 * @property string|null $hr_comments
 * @property \Illuminate\Support\Carbon|null $hr_action_at
 * @property string|null $hr_action_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Employee $employee
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit query()
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereEmployeeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereHrActionAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereHrActionBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereHrComments($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereLicensePlate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit wherePurpose($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereUsageEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereUsageStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit whereVehicleType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit pending()
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit approved()
 * @method static \Illuminate\Database\Eloquent\Builder|VehiclePermit rejected()
 * @method static \Database\Factories\VehiclePermitFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class VehiclePermit extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'employee_id',
        'vehicle_type',
        'license_plate',
        'usage_start',
        'usage_end',
        'purpose',
        'status',
        'hr_comments',
        'hr_action_at',
        'hr_action_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'usage_start' => 'datetime',
        'usage_end' => 'datetime',
        'hr_action_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the employee that owns the permit.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Scope a query to only include pending permits.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include approved permits.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include rejected permits.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}