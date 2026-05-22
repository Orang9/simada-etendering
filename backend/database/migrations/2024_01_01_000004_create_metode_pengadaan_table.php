<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('metodepengadaan', function (Blueprint $table) {
            $table->id('metode_id');
            $table->string('nama_metode', 100);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('metodepengadaan');
    }
};
