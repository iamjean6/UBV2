import { useState } from 'react'
import Home from './components/homepage'
import Shop from './components/shop'
import ProductPage from './components/products'
import Roster from './pages/roster'
import Layout from './components/layout'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Merch from './pages/merch'
import Contactus from './pages/contactus'
import Aboutus from './pages/aboutus'
import Games from './pages/games'
import Programs from './pages/programs'
import Gallery from './pages/gallery'
import Blog from './pages/blog'
import Easter from './pages/easter'
import Checkout from './pages/Checkout'
import Article from './pages/article'
import GameStats from './pages/gamestats'

// Admin Imports
import AdminLayout from './admin/layout/AdminLayout'
import LeaguesList from './admin/pages/sports/LeaguesList'
import Dashboard from './admin/pages/Dashboard'
import SuperAdminDashboard from './admin/pages/SuperAdminDashboard'
import ProductsList from './admin/pages/ecommerce/ProductsList'
import ProductForm from './admin/pages/ecommerce/ProductForm'
import ProductDetails from './admin/pages/ecommerce/ProductDetails'
import OrdersList from './admin/pages/ecommerce/OrdersList'
import Banners from './admin/pages/media/Banners'
import ProgramsList from './admin/pages/media/ProgramsList'
import ProgramForm from './admin/pages/media/ProgramForm'
import FeaturesList from './admin/pages/media/FeaturesList'
import FeatureForm from './admin/pages/media/FeatureForm'
import PlayersList from './admin/pages/sports/PlayersList'
import PlayerForm from './admin/pages/sports/PlayerForm'
import TeamsList from './admin/pages/sports/TeamsList'
import TeamForm from './admin/pages/sports/TeamForm'
import GamesList from './admin/pages/sports/GamesList'
import GameForm from './admin/pages/sports/GameForm'
import StatsForm from './admin/pages/sports/StatsForm'
import LeagueForm from './admin/pages/sports/LeagueForm'
import Login from './admin/pages/Login'
import { AuthProvider } from './admin/hooks/useAdminAuth'
import { ProtectedRoute } from './admin/components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/contactus" element={<Contactus />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/games" element={<Games />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<Article />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:id" element={<Gallery />} />
        <Route path="/shop/:id" element={<ProductPage />} />
        <Route path="/roster" element={<Roster />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/game-tracker/:id" element={<GameStats />} />
      </Route>
      <Route path="/easter" element={<Easter />} />

      {/* Admin Auth Routes (Publicly accessible but part of Admin system) */}
      <Route path="/admin/login" element={<AuthProvider><Login /></AuthProvider>} />
      <Route path="/superadmin/jean774431675" element={<AuthProvider><Login isSuperAdmin={true} /></AuthProvider>} />

      {/* Admin Routes with AuthProvider wrapper */}
      <Route path="/admin" element={
        <AuthProvider>
          <AdminLayout />
        </AuthProvider>
      }>
        <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="ecommerce/products" element={<ProtectedRoute><ProductsList /></ProtectedRoute>} />
        <Route path="ecommerce/products/new" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
        <Route path="ecommerce/products/edit/:slug" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
        <Route path="ecommerce/products/:slug/details" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="ecommerce/orders" element={<ProtectedRoute><OrdersList /></ProtectedRoute>} />
        <Route path="media/banners" element={<ProtectedRoute><Banners /></ProtectedRoute>} />
        <Route path="media/programs" element={<ProtectedRoute><ProgramsList /></ProtectedRoute>} />
        <Route path="media/programs/new" element={<ProtectedRoute><ProgramForm /></ProtectedRoute>} />
        <Route path="media/programs/edit/:id" element={<ProtectedRoute><ProgramForm /></ProtectedRoute>} />
        <Route path="media/features" element={<ProtectedRoute><FeaturesList /></ProtectedRoute>} />
        <Route path="media/features/new" element={<ProtectedRoute><FeatureForm /></ProtectedRoute>} />
        <Route path="media/features/edit/:id" element={<ProtectedRoute><FeatureForm /></ProtectedRoute>} />

        {/* Sports Routes */}
        <Route path="sports/players" element={<ProtectedRoute><PlayersList /></ProtectedRoute>} />
        <Route path="sports/players/new" element={<ProtectedRoute><PlayerForm /></ProtectedRoute>} />
        <Route path="sports/players/edit/:id" element={<ProtectedRoute><PlayerForm /></ProtectedRoute>} />
        <Route path="sports/teams" element={<ProtectedRoute><TeamsList /></ProtectedRoute>} />
        <Route path="sports/teams/new" element={<ProtectedRoute><TeamForm /></ProtectedRoute>} />
        <Route path="sports/teams/edit/:id" element={<ProtectedRoute><TeamForm /></ProtectedRoute>} />

        <Route path="sports/leagues" element={<ProtectedRoute><LeaguesList /></ProtectedRoute>} />
        <Route path="sports/leagues/new" element={<ProtectedRoute><LeagueForm /></ProtectedRoute>} />
        <Route path="sports/leagues/edit/:id" element={<ProtectedRoute><LeagueForm /></ProtectedRoute>} />

        <Route path="sports/games" element={<ProtectedRoute><GamesList /></ProtectedRoute>} />
        <Route path="sports/games/new" element={<ProtectedRoute><GameForm /></ProtectedRoute>} />
        <Route path="sports/games/edit/:id" element={<ProtectedRoute><GameForm /></ProtectedRoute>} />
        <Route path="sports/games/:gameId/stats" element={<ProtectedRoute><StatsForm /></ProtectedRoute>} />

        {/* Superadmin only routes */}
        <Route path="superadmin/activities" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />

        {/* Placeholder catch-all for other admin routes during MVP */}
        <Route path="*" element={
          <ProtectedRoute>
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <div className="text-center">
                <h3 className="mt-2 text-sm font-semibold text-gray-900">Coming Soon</h3>
                <p className="mt-1 text-sm text-gray-500">This module is under development.</p>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

export default App
