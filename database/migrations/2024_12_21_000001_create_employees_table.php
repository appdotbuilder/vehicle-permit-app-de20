<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id')->unique()->comment('Employee identification number');
            $table->string('name')->comment('Full name of the employee');
            $table->string('department')->comment('Department the employee belongs to');
            $table->string('grade')->comment('Employee grade level');
            $table->timestamps();
            
            // Add indexes for performance
            $table->index('employee_id');
            $table->index('department');
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};