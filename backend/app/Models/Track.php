<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Track extends Model
{
    protected $fillable = ['name', 'slug', 'program_id', 'department_id', 'description'];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function intakes()
    {
        return $this->belongsToMany(Intake::class, 'intake_tracks');
    }
}