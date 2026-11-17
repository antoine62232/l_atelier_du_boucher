import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const API = 'https://l-atelier-du-boucher.onrender.com'

// Contenus publics de l'API gardés pour le hors ligne. Rien de ce qui touche à un compte
// (profil, favoris, résultats) n'est mis en cache : une tablette d'atelier est partagée.
const ROUTES_PUBLIQUES = [
  'ressources', 'termes', 'tags', 'pieces', 'parties', 'questions', 'reponses-qcm',
  'recettes', 'ingredients', 'recettes-ingredients', 'instructions', 'actualites', 'faq', 'avis',
]

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: "L'Atelier du Boucher",
        short_name: 'Atelier Boucher',
        description: "Formation au métier de boucher : anatomie, découpe, recettes et quiz.",
        lang: 'fr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#8A1C25',
        background_color: '#FFFCF5',
        icons: [
          { src: '/icone-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icone-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icone-masquable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,woff2,webp,png,jpg}'],
        globIgnores: ['**/models/*.glb'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // Les modèles 3D sont versionnés dans leur nom : on les garde une fois téléchargés.
            urlPattern: ({ url }) => url.pathname.startsWith('/models/') && url.pathname.endsWith('.glb'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'modeles-3d',
              expiration: { maxEntries: 6 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: ({ url, request }) =>
              request.method === 'GET' &&
              url.origin === API &&
              ROUTES_PUBLIQUES.some((r) => url.pathname.startsWith(`/api/${r}/`) || url.pathname === `/api/${r}`),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'contenus',
              networkTimeoutSeconds: 6,
              expiration: { maxEntries: 300, maxAgeSeconds: 30 * 24 * 3600 },
              cacheableResponse: { statuses: [200] },
            },
          },
          {
            urlPattern: ({ url }) =>
              url.hostname === 'res.cloudinary.com' ||
              url.hostname === 'i.ytimg.com' ||
              (url.origin === API && url.pathname.startsWith('/uploads/')),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 300, maxAgeSeconds: 30 * 24 * 3600 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
})
