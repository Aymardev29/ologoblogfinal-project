import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register' // <-- 1. Import de la page d'inscription
import ArticleDetails from './pages/ArticleDetails'
import CreateArticle from './pages/CreateArticle'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* 2. Route pour l'inscription */}
        <Route path="/register" element={<Register />} /> 
        
        <Route path="/article/:id" element={<ArticleDetails />} />
        <Route path="/create-article" element={<CreateArticle />} /> 
      </Routes>
    </Router>
  )
}

export default App