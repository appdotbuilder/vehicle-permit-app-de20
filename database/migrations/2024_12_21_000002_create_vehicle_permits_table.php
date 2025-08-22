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
        Schema::create('vehicle_permits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->string('vehicle_type')->comment('Type of vehicle requested');
            $table->string('license_plate')->comment('License plate number');
            $table->dateTime('usage_start')->comment('Start date and time of usage');
            $table->dateTime('usage_end')->comment('End date and time of usage');
            $table->text('purpose')->nullable()->comment('Purpose of vehicle usage');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending')->comment('Request status');
            $table->text('hr_comments')->nullable()->comment('HR comments on the request');
            $table->timestamp('hr_action_at')->nullable()->comment('When HR took action');
            $table->string('hr_action_by')->nullable()->comment('HR user who took action');
            $table->timestamps();
            
            // Add indexes for performance
            $table->index('employee_id');
            $table->index('status');
            $table->index('usage_start');
            $table->index('usage_end');
            $table->index(['status', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_permits');
    }
};