<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengguna', function (Blueprint $table) {
            $table->id('pengguna_id');
            $table->string('nama', 150);
            $table->string('email', 150)->unique();
            $table->string('password', 255);
            $table->unsignedBigInteger('role_id');
            $table->foreign('role_id')
                  ->references('role_id')
                  ->on('role')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengguna');
    }
};
