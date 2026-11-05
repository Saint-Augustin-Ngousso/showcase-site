import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Paroisse from './pages/Paroisse.jsx'
import Pretres from './pages/Pretres.jsx'
import Messes from './pages/Messes.jsx'
import Secteurs from './pages/Secteurs.jsx'
import SecteurDetail from './pages/SecteurDetail.jsx'
import Mouvements from './pages/Mouvements.jsx'
import Agenda from './pages/Agenda.jsx'
import Contact from './pages/Contact.jsx'
import Foi from './pages/Foi.jsx'
import Priere from './pages/Priere.jsx'
import Mediatheque from './pages/Mediatheque.jsx'
import Recherche from './pages/Recherche.jsx'
import Confidentialite from './pages/Confidentialite.jsx'

function LegacyCevRedirect() {
  const { secteur } = useParams()
  return <Navigate to={`/secteurs/${secteur}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="paroisse" element={<Paroisse />} />
        <Route path="pretres" element={<Pretres />} />
        <Route path="messes" element={<Messes />} />
        <Route path="secteurs" element={<Secteurs />} />
        <Route path="secteurs/:secteur" element={<SecteurDetail />} />
        <Route path="mouvements" element={<Mouvements />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="contact" element={<Contact />} />
        <Route path="foi" element={<Foi />} />
        <Route path="priere" element={<Priere />} />
        <Route path="mediatheque" element={<Mediatheque />} />
        <Route path="recherche" element={<Recherche />} />
        <Route path="confidentialite" element={<Confidentialite />} />

        <Route path="pretre" element={<Navigate to="/pretres" replace />} />
        <Route path="sacrements" element={<Navigate to={{ pathname: '/messes', hash: 'sacrements' }} replace />} />
        <Route path="communaute" element={<Navigate to="/secteurs" replace />} />
        <Route path="communaute/dominicales" element={<Navigate to="/messes" replace />} />
        <Route path="communaute/cev" element={<Navigate to="/secteurs" replace />} />
        <Route path="communaute/cev/:secteur" element={<LegacyCevRedirect />} />
        <Route path="communaute/associations" element={<Navigate to="/mouvements" replace />} />
        <Route path="jeunes" element={<Navigate to={{ pathname: '/mouvements', hash: 'jeunes' }} replace />} />
        <Route path="actualites" element={<Navigate to="/agenda" replace />} />
        <Route path="dons" element={<Navigate to={{ pathname: '/contact', hash: 'soutien' }} replace />} />
        <Route path="servir" element={<Navigate to={{ pathname: '/mouvements', hash: 'servir' }} replace />} />
        <Route path="vie-paroissiale" element={<Navigate to="/secteurs" replace />} />
        <Route path="evangelisation" element={<Navigate to="/foi" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
