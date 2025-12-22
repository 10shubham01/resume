// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],
  ssr: true,

  devtools: {
    enabled: true
  },

  app: {
    head: {
      title: 'Resume Editor - Create Professional Resumes Online',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Create, edit, and export professional resumes with our free online resume editor. Customize typography, colors, and layout. Export as JSON or print to PDF.' },
        { name: 'keywords', content: 'resume editor, CV builder, resume maker, online editor, free resume, document editor, A4 editor, resume template, professional resume' },
        { name: 'author', content: 'Shubham Gupta' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#3b82f6' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Resume Editor - Create Professional Resumes Online' },
        { property: 'og:description', content: 'Create, edit, and export professional resumes with our free online resume editor. Customize typography, colors, and layout.' },
        { property: 'og:site_name', content: 'Resume Editor' },
        { property: 'og:locale', content: 'en_US' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Resume Editor - Create Professional Resumes Online' },
        { name: 'twitter:description', content: 'Create, edit, and export professional resumes with our free online resume editor.' },

        // Additional
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://resume.shubham.gupta' }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  ui: {
    experimental: {
      componentDetection: true
    }
  },

  runtimeConfig: {
    public: {
      partykitHost: ''
    }
  },

  compatibilityDate: '2025-01-15',

  vite: {
    optimizeDeps: {
      include: [
        'prosemirror-state',
        'prosemirror-view',
        'yjs',
        'y-partykit/provider'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
