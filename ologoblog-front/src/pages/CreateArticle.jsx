import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'

function CreateArticle() {
  const navigate = useNavigate()
  
  // États du formulaire
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  
  // États de gestion des retours
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Protection de la page côté Front
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  const handleCreateArticle = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const token = localStorage.getItem('token')

    // 1. Initialisation de l'objet FormData pour gérer le fichier binaire
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('category_id', 1) // Correction de la contrainte Laravel
    
    // Récupération sécurisée de l'utilisateur connecté
    const localUserData = localStorage.getItem('user')
    let userIdToSend = 1 

    if (localUserData) {
      try {
        const parsedUser = JSON.parse(localUserData)
        userIdToSend = parsedUser.id || parsedUser.user_id ||  1
      } catch (err) {
        console.error("Erreur de lecture de l'utilisateur local :", err)
      }
    }
    
    // Ajout de l'ID utilisateur au FormData
    formData.append('user_id', userIdToSend)
       
    // 2. Ajout du fichier image s'il a été sélectionné par le chercheur
    if (image) {
      formData.append('image', image)
    }

    // 3. Appel Axios configuré avec le bon Content-Type pour l'upload
    axios.post('http://127.0.0.1:8000/api/articles', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Indispensable pour transmettre l'image
        'Accept': 'application/json'
      }
    })
    .then((response) => {
      console.log("Succès !", response.data)
      setLoading(false)
      navigate('/')
    })
    .catch((err) => {
      console.error("Erreur attrapée :", err)
      setLoading(false)
      
      if (err.response && err.response.status === 401) {
        setError("Votre session a expiré ou vous n'êtes pas autorisé. Veuillez vous reconnecter.")
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message)
      } else {
        setError("Impossible d'enregistrer l'article. Vérifiez la configuration de l'API.")
      }
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-2xl mx-auto p-6 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-brand">Nouvelle publication scientifique</h1>
            <p className="text-gray-500 text-sm mt-1">Rédigez et publiez vos conclusions d'analyses biologiques.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleCreateArticle} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'analyse</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand"
                placeholder="Ex: Analyse de la surexpression du gène TP53..."
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenu / Description des résultats</label>
              <textarea 
                required
                rows="6"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand"
                placeholder="Décrivez ici vos protocoles, séquençages d'ADN ou observations..."
              ></textarea>
            </div>

            {/* 4. AJOUT : Champ de sélection de l'image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Illustration de l'analyse (Optionnel)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-brand bg-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-brand hover:file:bg-orange-100 cursor-pointer"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-brand text-white font-medium py-2.5 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? "Publication en cours..." : "Publier l'article"}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default CreateArticle