import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

function ArticleDetails() {
  const { id } = useParams() // Récupère l'id depuis l'URL
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Appel de l'article spécifique sur ton API Laravel
    axios.get('http://127.0.0.1:8000/api/articles/${id}')
      'then'(response => {
        setArticle(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Erreur lors du chargement de l'article :", error)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <div className="text-center mt-12 text-gray-500">Chargement de l'analyse biologique...</div>
  }

  if (!article) {
    return (
      <div className="text-center mt-12">
        <p className="text-red-500 font-medium">Article introuvable.</p>
        <Link to="/" className="text-brand underline mt-4 inline-block">Retour à l'accueil</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Bouton Retour */}
        <Link to="/" className="text-sm font-medium text-gray-500 hover:text-brand transition flex items-center gap-1 mb-6">
          ← Retour aux articles
        </Link>

        {/* Conteneur Principal */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden p-8">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">
            {article.category?.name || 'Analyse Scientifique'}
          </span>
          
          <h1 className="text-3xl font-bold text-brand mt-2 mb-4">
            {article.title}
          </h1>

          <p className="text-xs text-gray-400 mb-6">
            Publié par : <span className="font-medium text-gray-600">{article.user?.name || 'Chercheur principal'}</span>
          </p>

          {/* Rapport textuel */}
          <div className="prose max-w-none text-gray-700 leading-relaxed mb-8 whitespace-pre-line">
            {article.content}
          </div>

          {/* ESPACE VISUALISATION DE DONNÉES / GRAPHIQUES */}
          <div className="border-2 border-dashed border-accent/30 bg-accent/5 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-lg font-bold text-brand">Visualisation Graphique du Gène</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-4">
              C'est ici qu'on viendra brancher ta bibliothèque de graphiques (Chart.js ou Recharts) pour afficher les courbes d'expression ou les séquences d'ADN liées à l'article {id}.
            </p>
            <div className="inline-block px-4 py-2 bg-white rounded-lg shadow-xs border border-slate-100 text-xs font-mono text-gray-600">
              [Données prêtes pour composant graphique]
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleDetails