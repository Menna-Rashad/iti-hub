<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    use HasFactory;

    protected $table = 'job_listings'; // because the table name is not the plural of the model name

    protected $fillable = [
        'title',
        'company_name',
        'location',
        'job_type',
        'job_state',
        'description',
        'is_available',
        'requirements',
        'salary_range',
        'apply_link'
    ];
}

