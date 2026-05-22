<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('masyarakat', function (Blueprint $table) {
            $table->id('masyarakat_id');
            $table->string('nama', 150);
            $table->string('email', 150)->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('masyarakat');
    }
};
