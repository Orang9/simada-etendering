<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('aksesinformasi', function (Blueprint $table) {
            $table->id('akses_id');
            $table->unsignedBigInteger('masyarakat_id');
            $table->unsignedBigInteger('paket_id');
            $table->dateTime('waktu_akses');

            $table->foreign('masyarakat_id')
                  ->references('masyarakat_id')
                  ->on('Masyarakat')
                  ->onDelete('cascade');

            $table->foreign('paket_id')
                  ->references('paket_id')
                  ->on('PaketPengadaan')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('aksesinformasi');
    }
};
