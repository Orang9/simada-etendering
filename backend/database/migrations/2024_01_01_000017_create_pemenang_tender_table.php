<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pemenangtender', function (Blueprint $table) {
            $table->id('pemenang_id');
            $table->unsignedBigInteger('paket_id')->unique();
            $table->unsignedBigInteger('penawaran_id')->unique();
            $table->unsignedBigInteger('pengguna_id');
            $table->date('tanggal_penetapan');
            $table->decimal('nilai_final', 15, 2);
            $table->string('status_pemenang', 50);
            $table->text('catatan_penetapan')->nullable();

            $table->foreign('paket_id')
                  ->references('paket_id')
                  ->on('PaketPengadaan')
                  ->onDelete('cascade');

            $table->foreign('penawaran_id')
                  ->references('penawaran_id')
                  ->on('Penawaran')
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
        Schema::dropIfExists('pemenangtender');
    }
};
