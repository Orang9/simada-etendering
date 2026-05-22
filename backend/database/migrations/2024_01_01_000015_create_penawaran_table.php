<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('penawaran', function (Blueprint $table) {
            $table->id('penawaran_id');
            $table->unsignedBigInteger('paket_id');
            $table->unsignedBigInteger('pengguna_id');
            $table->string('nomor_penawaran', 50);
            $table->decimal('nilai_penawaran', 15, 2);
            $table->date('tanggal_penawaran');
            $table->string('status_penawaran', 50);
            $table->text('catatan')->nullable();

            $table->foreign('paket_id')
                  ->references('paket_id')
                  ->on('PaketPengadaan')
                  ->onDelete('cascade');

            $table->foreign('pengguna_id')
                  ->references('pengguna_id')
                  ->on('Pengguna')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penawaran');
    }
};
