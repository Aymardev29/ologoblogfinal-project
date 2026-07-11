<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    // Autoriser le remplissage de ces champs
    protected $fillable = ['content', 'article_id', 'user_id'];

    // Relation : Un commentaire appartient à un article
    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    // Relation : Un commentaire appartient à un utilisateur (auteur)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}