<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('progress', function (Blueprint $table) {
            $table->id('progress_id');
            $table->unsignedBigInteger('paket_id');
            $table->date('tanggal');
            $table->string('status_progress', 100);
            $table->text('keterangan')->nullable();
            $table->foreign('paket_id')
                ->references('paket_id')
                ->on('PaketPengadaan')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('progress');
    }
};
