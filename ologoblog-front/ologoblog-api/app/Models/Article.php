<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Article extends Model
{
    protected $fillable = ['title', 'content', 'category_id', 'user_id', 'slug', 'image'];

    protected static function booted()
    {
        static::creating(function ($article) {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title) . '-' . uniqid();
            }
        });
    }

    /**
     * CORRECTION : La relation avec la catégorie attendue par Laravel
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Par sécurité, on ajoute aussi la relation avec l'utilisateur
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
public function comments()
{
    return $this->hasMany(Comment::class);
}


}