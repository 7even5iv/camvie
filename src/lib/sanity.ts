import { createClient } from '@sanity/client'

export const sanityClient = createClient({
  projectId: 'qz8e54hy',   // ← à remplacer !
  dataset: 'production',
  useCdn: true,
  apiVersion: '2026-10-21',
})

export const sanityWriteClient = createClient({
  projectId: 'qz8e54hy',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-10-21',
  token: import.meta.env.VITE_SANITY_TOKEN,
})