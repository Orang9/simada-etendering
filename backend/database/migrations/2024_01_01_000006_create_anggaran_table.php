<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('anggaran', function (Blueprint $table) {
            $table->id('anggaran_id');
            $table->unsignedBigInteger('paket_id')->unique();
            $table->decimal('nilai', 15, 2);
            $table->year('tahun');
            $table->foreign('paket_id')
                  ->references('paket_id')
                  ->on('PaketPengadaan')
                  ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('anggaran');
    }
};
