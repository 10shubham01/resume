<script setup lang="ts">
import type { EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'
import { Emoji } from '@tiptap/extension-emoji'
import TextAlign from '@tiptap/extension-text-align'
import ImageUpload from '../components/editor/ImageUpload'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const room = computed(() => route.query.room as string | undefined)

const user = useState('user', () => ({
  name: getRandomName(),
  color: getRandomColor()
}))

const appConfig = useAppConfig()

const editorRef = useTemplateRef('editorRef')

// LocalStorage key for persisting editor content
const STORAGE_KEY = 'editor-content'

// Load content from localStorage on client side
const loadFromStorage = () => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

const {
  enabled: collaborationEnabled,
  ready: collaborationReady,
  extensions: collaborationExtensions,
  connectedUsers
} = useEditorCollaboration({
  room: room.value,
  host: runtimeConfig.public.partykitHost,
  user: {
    name: user.value.name,
    color: COLORS[user.value.color]!
  }
})

// Set primary color for the app
if (collaborationEnabled) {
  appConfig.ui.colors.primary = user.value.color
}

// Custom handlers for editor
const customHandlers = {
  imageUpload: {
    canExecute: (editor: Editor) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: Editor) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: Editor) => editor.isActive('imageUpload'),
    isDisabled: undefined
  }
} satisfies EditorCustomHandlers

const { items: emojiItems } = useEditorEmojis()
const { items: mentionItems } = useEditorMentions(connectedUsers)
const { items: suggestionItems } = useEditorSuggestions(customHandlers)
const { getItems: getDragHandleItems, onNodeChange } = useEditorDragHandle(customHandlers)
const { bubbleToolbarItems, getImageToolbarItems } = useEditorToolbar(customHandlers)

// Initialize content with localStorage or default
const storedContent = loadFromStorage()
// Default content - only used when Y.js document is empty
const content = ref(
  storedContent || {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          { type: 'text', text: 'Shubham Gupta' },
          { type: 'hardBreak' },
          { type: 'text', text: 'Email: shubhamedu.01@gmail.com' },
          { type: 'hardBreak' },
          { type: 'text', text: 'Website | GitHub | LinkedIn | +91 9369745870' }
        ]
      },

      { type: 'paragraph', attrs: { textAlign: null } },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          { type: 'text', text: 'PROFILE' },
          { type: 'hardBreak' },
          {
            type: 'text',
            text: 'Experienced Software Developer with a solid foundation in full-stack development. Proficient in JavaScript, TypeScript, Vue.js, React.js, Nuxt.js, Next.js, Node.js, and MySQL, committed to delivering impactful and results-focused solutions.'
          }
        ]
      },

      { type: 'paragraph', attrs: { textAlign: null } },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          { type: 'text', text: 'SKILLS' },
          { type: 'hardBreak' },
          {
            type: 'text',
            text: 'Advanced Knowledge: TypeScript, JavaScript, NodeJS, HTML, CSS, Tailwind, VueJS, NuxtJS, ReactJS, NextJS, AdonisJS, ExpressJS, PostgreSQL, MySQL, Git, Bash, Webpack, Vite, AWS, GitHub CI/CD'
          },
          { type: 'hardBreak' },
          {
            type: 'text',
            text: 'Basic Knowledge: C, C++, Java, Python'
          }
        ]
      },

      { type: 'paragraph', attrs: { textAlign: null } },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          { type: 'text', text: 'EXPERIENCE' },
          { type: 'hardBreak' },
          {
            type: 'text',
            text: 'Senior Software Engineer — Credilio Financial Technologies (Dec 2022 – Present)'
          }
        ]
      },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          {
            type: 'text',
            text: 'Led a team of engineers, conducted code reviews, mentored junior developers, and onboarded 5+ engineers to improve productivity.'
          },
          { type: 'hardBreak' },
          {
            type: 'text',
            text: 'Managed and optimized GitHub CI/CD pipelines and AWS deployments.'
          }
        ]
      },

      { type: 'paragraph', attrs: { textAlign: null } },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          { type: 'text', text: 'KEY PROJECTS' }
        ]
      },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          { type: 'text', text: 'Customer Portal' },
          { type: 'hardBreak' },
          {
            type: 'text',
            text: 'Integrated bank APIs for credit card and loan journeys, improved maintainability by 20% using composable architecture, optimized performance with async components, virtual scrolling, debouncing, and throttling.'
          }
        ]
      },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          {
            type: 'text',
            text: 'Implemented theming customization, robust validations (Zod, Yup, Vee-Validate), and enforced quality using ESLint, Prettier, and Vite optimizations.'
          }
        ]
      },

      { type: 'paragraph', attrs: { textAlign: null } },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          { type: 'text', text: 'Advisor Portal' },
          { type: 'hardBreak' },
          {
            type: 'text',
            text: 'Built accessible reusable components, reporting systems with secure downloads, native app integrations, and JWT-based authentication.'
          }
        ]
      },

      { type: 'paragraph', attrs: { textAlign: null } },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          { type: 'text', text: 'Plug and Play Platform' },
          { type: 'hardBreak' },
          {
            type: 'text',
            text: 'Delivered dynamic theming, WebView communication for Android/iOS apps, and led a team of 3–4 developers supporting partner integrations.'
          }
        ]
      },

      { type: 'paragraph', attrs: { textAlign: null } },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          { type: 'text', text: 'Admin Portal' },
          { type: 'hardBreak' },
          {
            type: 'text',
            text: 'Engineered role-based access control systems and CSV-based administrative reporting tools.'
          }
        ]
      },

      { type: 'paragraph', attrs: { textAlign: null } },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          {
            type: 'text',
            text: 'Software Engineer / Trainee — Mountblue (Aug 2021 – Nov 2022)'
          },
          { type: 'hardBreak' },
          {
            type: 'text',
            text: 'Built full-stack apps with Vue, React, Node.js, migrated Nuxt 2 to Nuxt 3, and adopted modern tooling.'
          }
        ]
      },

      { type: 'paragraph', attrs: { textAlign: null } },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          { type: 'text', text: 'EDUCATION' },
          { type: 'hardBreak' },
          {
            type: 'text',
            text: 'Bachelor of Computer Applications — Lovely Professional University (2018 – 2021)'
          }
        ]
      },

      { type: 'paragraph', attrs: { textAlign: null } },

      {
        type: 'paragraph',
        attrs: { textAlign: null },
        content: [
          { type: 'text', text: 'OPEN SOURCE PROJECTS' },
          { type: 'hardBreak' },
          {
            type: 'text',
            text: 'Spotlight Chrome Extension, Symbiote UI (Under Development), API Logger'
          }
        ]
      }
    ]
  }

)

// Set initial content for collaborative documents (only if empty)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onCreate({ editor }: any) {
  if (!collaborationEnabled) return

  const storageKey = `editor-initialized-${room.value}`

  // Skip if already initialized this session (handles HMR)
  if (sessionStorage.getItem(storageKey)) return

  // Wait for Y.js to sync existing content from server before checking if empty
  setTimeout(() => {
    const text = editor.state.doc.textContent.trim()
    if (!text) {
      editor.commands.setContent(content.value, { contentType: 'json' })
    }
    sessionStorage.setItem(storageKey, 'true')
  }, 500)
}

function onUpdate(value: string) {
  if (!collaborationEnabled) {
    content.value = value
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    }
  }
}

const extensions = computed(() => [
  Emoji,
  ImageUpload,
  TextAlign.configure({
    types: ['heading', 'paragraph']
  }),
  ...collaborationExtensions.value
])

// Export/Import functionality
const fileInput = useTemplateRef('fileInput')

const exportJSON = () => {
  const dataStr = JSON.stringify(content.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `editor-content-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

const importJSON = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const jsonContent = JSON.parse(e.target?.result as string)
      content.value = jsonContent

      // Update editor content
      const editor = editorRef.value?.editor
      if (editor) {
        editor.commands.setContent(jsonContent, { contentType: 'json' })
      }

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonContent))
      }
    } catch (error) {
      console.error('Failed to parse JSON file:', error)
    }
  }
  reader.readAsText(file)
  // Reset input
  target.value = ''
}
</script>

<template>
  <div>
    <!-- Export/Import Controls -->
    <div class="fixed top-4 right-4 z-50 flex gap-2 print:hidden">
      <UButton
        icon="i-lucide-download"
        color="neutral"
        variant="soft"
        size="sm"
        label="Export"
        @click="exportJSON"
      />
      <UButton
        icon="i-lucide-upload"
        color="neutral"
        variant="soft"
        size="sm"
        label="Import"
        @click="importJSON"
      />
      <input
        ref="fileInput"
        type="file"
        accept="application/json"
        class="hidden"
        @change="handleFileUpload"
      >
    </div>

    <UEditor
      v-if="collaborationReady"
      ref="editorRef"
      v-slot="{ editor, handlers }"
      :model-value="content"
      content-type="json"
      :extensions="extensions"
      :handlers="customHandlers"
      autofocus
      placeholder="Write, type '/' for commands..."
      class="min-h-screen"
      :ui="{
        base: 'p-4 sm:px-6',
        content: 'max-w-4xl mx-auto'
      }"
      @update:model-value="onUpdate"
      @create="onCreate"
    >
      <UEditorToolbar
        :editor="editor"
        :items="bubbleToolbarItems"
        layout="bubble"
        :should-show="({ editor, view, state }: any) => {
          if (editor.isActive('imageUpload') || editor.isActive('image')) {
            return false
          }
          const { selection } = state
          return view.hasFocus() && !selection.empty
        }"
      >
        <template #link>
          <EditorLinkPopover :editor="editor" />
        </template>
      </UEditorToolbar>

      <UEditorToolbar
        :editor="editor"
        :items="getImageToolbarItems(editor)"
        layout="bubble"
        :should-show="({ editor, view }: any) => {
          return editor.isActive('image') && view.hasFocus()
        }"
      />

      <UEditorDragHandle
        v-slot="{ ui, onClick }"
        :editor="editor"
        @node-change="onNodeChange"
      >
        <UButton
          icon="i-lucide-plus"
          color="neutral"
          variant="ghost"
          size="sm"
          :class="ui.handle()"
          @click="(e: MouseEvent) => {
            e.stopPropagation()
            const node = onClick()

            handlers.suggestion?.execute(editor, { pos: node?.pos }).run()
          }"
        />

        <UDropdownMenu
          v-slot="{ open }"
          :modal="false"
          :items="getDragHandleItems(editor)"
          :content="{ side: 'left' }"
          :ui="{ content: 'w-48', label: 'text-xs' }"
          @update:open="editor.chain().setMeta('lockDragHandle', $event).run()"
        >
          <UButton
            color="neutral"
            variant="ghost"
            active-variant="soft"
            size="sm"
            icon="i-lucide-grip-vertical"
            :active="open"
            :class="ui.handle()"
          />
        </UDropdownMenu>
      </UEditorDragHandle>

      <UEditorEmojiMenu
        :editor="editor"
        :items="emojiItems"
      />
      <UEditorMentionMenu
        :editor="editor"
        :items="mentionItems"
      />
      <UEditorSuggestionMenu
        :editor="editor"
        :items="suggestionItems"
      />
    </UEditor>
  </div>
</template>
