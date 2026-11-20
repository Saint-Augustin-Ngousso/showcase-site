import { lazy, Suspense } from 'react'
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
import Connexion from './pages/Connexion.jsx'
import AssociationDetail from './pages/AssociationDetail.jsx'
import EnseignementDetail from './pages/EnseignementDetail.jsx'
const AdminLayout = lazy(() => import('./admin/AdminLayout.jsx'))
const Dashboard = lazy(() => import('./admin/Dashboard.jsx'))
const SettingsPage = lazy(() => import('./admin/SettingsPage.jsx'))
const ResourceManager = lazy(() => import('./admin/ResourceManager.jsx'))
const AgendaImport = lazy(() => import('./admin/AgendaImport.jsx'))
const Intentions = lazy(() => import('./admin/Intentions.jsx'))
const Requests = lazy(() => import('./admin/Requests.jsx'))
const Users = lazy(() => import('./admin/Users.jsx'))

function LegacyCevRedirect() {
  const { secteur } = useParams()
  return <Navigate to={`/secteurs/${secteur}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/espace"
        element={
          <Suspense fallback={<p className="p-6 text-muted">Chargement de l’administration…</p>}>
            <AdminLayout />
          </Suspense>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="parametres" element={<SettingsPage />} />
        <Route path="r/:resourceKey" element={<ResourceManager />} />
        <Route path="import-agenda" element={<AgendaImport />} />
        <Route path="intentions" element={<Intentions />} />
        <Route path="demandes" element={<Requests />} />
        <Route path="utilisateurs" element={<Users />} />
        <Route path="*" element={<Navigate to="/espace" replace />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="paroisse" element={<Paroisse />} />
        <Route path="pretres" element={<Pretres />} />
        <Route path="messes" element={<Messes />} />
        <Route path="secteurs" element={<Secteurs />} />
        <Route path="secteurs/:secteur" element={<SecteurDetail />} />
        <Route path="mouvements" element={<Mouvements />} />
        <Route path="mouvements/:slug" element={<AssociationDetail />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="contact" element={<Contact />} />
        <Route path="foi" element={<Foi />} />
        <Route path="foi/enseignements/:id" element={<EnseignementDetail />} />
        <Route path="priere" element={<Priere />} />
        <Route path="mediatheque" element={<Mediatheque />} />
        <Route path="recherche" element={<Recherche />} />
        <Route path="confidentialite" element={<Confidentialite />} />
        <Route path="connexion" element={<Connexion />} />

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
