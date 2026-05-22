<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('sistemeksternal', function (Blueprint $table) {
            $table->id('sistem_eksternal_id');
            $table->string('nama_sistem', 150);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('sistemeksternal');
    }
};
