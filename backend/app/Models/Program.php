<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'duration', 'fees', 'eligibility',
        'graduates_count', 'job_profiles'
    ];

    protected $casts = [
        'eligibility' => 'array',
    ];

    public function tracks()
    {
        return $this->hasMany(Track::class);
    }

    public function intakes()
    {
        return $this->hasMany(Intake::class);
    }
}