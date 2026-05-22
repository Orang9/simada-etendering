<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('integrasisistem', function (Blueprint $table) {
            $table->id('integrasi_id');
            $table->unsignedBigInteger('paket_id');
            $table->unsignedBigInteger('sistem_eksternal_id');
            $table->string('jenis_integrasi', 100);
            $table->dateTime('waktu_integrasi');

            $table->foreign('paket_id')
                  ->references('paket_id')
                  ->on('PaketPengadaan')
                  ->onDelete('cascade');

            $table->foreign('sistem_eksternal_id')
                  ->references('sistem_eksternal_id')
                  ->on('SistemEksternal')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('integrasisistem');
    }
};
