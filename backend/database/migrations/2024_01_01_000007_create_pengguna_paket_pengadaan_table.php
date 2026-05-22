<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('penggunapaketpengadaan', function (Blueprint $table) {
            $table->id('id_pengguna_paket');
            $table->unsignedBigInteger('pengguna_id');
            $table->unsignedBigInteger('paket_id');
            $table->string('peran_dalam_paket', 100);

            $table->foreign('pengguna_id')
                  ->references('pengguna_id')
                  ->on('Pengguna')
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
        Schema::dropIfExists('penggunapaketpengadaan');
    }
};
