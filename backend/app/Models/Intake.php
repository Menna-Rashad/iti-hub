<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Intake extends Model
{
    protected $fillable = [
        'program_id', 'intake_cycle', 'status', 'admission_start',
        'admission_end', 'training_start', 'training_end'
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function tracks()
    {
        return $this->belongsToMany(Track::class, 'intake_tracks');
    }
}