import { useState, useEffect } from 'react'
import axios from 'axios'

function CommentSection({ articleId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // 1. Récupérer les commentaires existants pour cet article
  useEffect(() => {
    // Note : On va demander à Laravel de nous donner l'article avec ses commentaires
    axios.get(`http://127.0.0.1:8000/api/articles/${articleId}`)
      .then(response => {
        // Si ton API renvoie l'article, ses commentaires sont dans article.comments
        if (response.data && response.data.comments) {
          setComments(response.data.comments)
        }
      })
      .catch(error => {
        console.error("Erreur lors du chargement des commentaires :", error)
      })
  }, [articleId])

  // 2. Soumettre un nouveau commentaire
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)

    // Configuration temporaire : on envoie un user_id statique (ex: 1) 
    // en attendant d'avoir ton système d'authentification complet connecté
    const commentData = {
      content: newComment,
      article_id: articleId,
      user_id: 1 
    }

    axios.post('http://127.0.0.1:8000/api/comments', commentData)
      .then(response => {
        // On ajoute instantanément le nouveau commentaire à la liste affichée
        setComments([...comments, response.data])
        setNewComment('') // On vide le champ de texte
        setSubmitting(false)
      })
      .catch(error => {
        console.error("Erreur lors de l'envoi du commentaire :", error)
        setSubmitting(false)
      })
  }

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <h3 className="text-lg font-bold text-brand mb-4 flex items-center gap-2">
        Discussion scientifique 💬 
        <span className="text-xs bg-slate-100 text-gray-600 px-2 py-0.5 rounded-full">
          {comments.length}
        </span>
      </h3>

      {/* Liste des commentaires */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Aucun commentaire pour le moment. Soyez le premier à participer !</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-brand">
                  {comment.user?.name || "Chercheur Anonyme"}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          rows="3"
          className="w-full p-3 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-brand transition"
          placeholder="Ajouter une remarque ou une analyse sur ces données..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="self-end px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
        >
          {submitting ? 'Envoi...' : 'Commenter'}
        </button>
      </form>
    </div>
  )
}

export default CommentSection