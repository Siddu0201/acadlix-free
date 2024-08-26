<?php

namespace Yuvayana\Acadlix\Models;

use Illuminate\Database\Eloquent\Model;

defined( 'ABSPATH' ) || exit();

if(!class_exists('ParagraphLang')){
    class ParagraphLang extends Model
    {
        protected $table = "paragraph_lang";

        protected $fillable = [
            "paragraph_id",
            "language_id",
            "default",
            "content"
        ]; 
        
        protected $with = ['language'];

        public function paragraph(){
            return $this->belongsTo(Paragraph::class, 'paragraph_id', 'id');
        }

        public function language(){
            return $this->belongsTo(Language::class, 'language_id', 'id');
        }
    }
}