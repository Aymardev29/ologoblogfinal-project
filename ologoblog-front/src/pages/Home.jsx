import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CommentSection from '../components/CommentSection'

function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/articles')
      .then(response => {
        setArticles(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des articles :", error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="p-6">
        <header className="max-w-6xl mx-auto mb-12 text-center mt-6">
          <h1 className="text-4xl font-bold text-brand mb-4">
            Visualisation de données Biologiques 🧬
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Découvrez nos analyses d'expression de gènes et séquençages d'ADN.
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          {loading ? (
            <div className="text-center text-gray-500 font-medium">Chargement des articles scientifiques...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles?.map(article => (
                <article key={article.id} className="bg-white rounded-xl shadow-xs border border-slate-100 overflow-hidden flex flex-col">
                  
                  {/* 📸 BLOC IMAGE */}
                  {article.image_cover && (
                    <div className="w-full h-48 bg-slate-100 overflow-hidden border-b border-slate-100">
                      <img 
                        src={`http://127.0.0.1:8000/storage/${article.image_cover.replace('public/', '')}`} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1532187863486-abf9d39d6618?auto=format&fit=crop&q=80&w=500";
                        }}
                      />
                    </div>
                  )}

                  {/* 📝 CONTENU DE L'ARTICLE */}
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                      {article.category?.name || 'Science'}
                    </span>
                    <h2 className="text-xl font-bold text-brand mt-2 mb-3">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {article.content}
                    </p>

                    {/* 💬 ZONE DE COMMENTAIRES PLACÉE ICI (Intérieur de la carte) */}
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <CommentSection articleId={article.id} />
                    </div>
                  </div>

                  {/* 🔗 PIED DE CARTE */}
                  <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <Link className="text-brand font-medium text-sm hover:text-orange-600 transition flex items-center gap-1">
                      Visualiser les données →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Home