<script setup lang="ts">
import type { EditorCustomHandlers } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'
import { Emoji } from '@tiptap/extension-emoji'
import TextAlign from '@tiptap/extension-text-align'
import ImageUpload from '../components/editor/ImageUpload'

const route = useRoute()
const runtimeConfig = useRuntimeConfig()

const room = computed(() => route.query.room as string | undefined)
const hideWatermark = computed(() => route.query.thanks === 'shubham')

// SEO Meta Tags
useSeoMeta({
  title: 'Resume Editor - Create Professional Resumes Online',
  description: 'Free online resume editor with A4 page preview. Customize typography, colors, spacing. Export as JSON or print to PDF. Perfect for creating professional CVs and resumes.',
  ogTitle: 'Resume Editor - Create Professional Resumes Online',
  ogDescription: 'Free online resume editor with A4 page preview. Customize typography, colors, spacing. Export as JSON or print to PDF.',
  ogType: 'website',
  ogUrl: 'https://resume.shubham.gupta',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Resume Editor - Create Professional Resumes Online',
  twitterDescription: 'Free online resume editor with A4 page preview. Perfect for creating professional CVs and resumes.'
})

const user = useState('user', () => ({
  name: getRandomName(),
  color: getRandomColor()
}))

const appConfig = useAppConfig()

const editorRef = useTemplateRef('editorRef')

// LocalStorage key for persisting editor content
const STORAGE_KEY = 'editor-content'
const SETTINGS_KEY = 'editor-settings'

// Load content from localStorage on client side
const loadFromStorage = () => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

// Settings modal
const isSettingsOpen = ref(false)

// Load settings from localStorage
const loadSettings = () => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(SETTINGS_KEY)
  return stored ? JSON.parse(stored) : null
}

// Initialize settings with saved values or defaults
const savedSettings = loadSettings()
const settings = reactive({
  primaryColor: savedSettings?.primaryColor || appConfig.ui.colors.primary || 'blue',
  neutralColor: savedSettings?.neutralColor || appConfig.ui.colors.neutral || 'stone',
  // Typography
  h1Size: savedSettings?.h1Size || 'text-3xl',
  h2Size: savedSettings?.h2Size || 'text-2xl',
  h3Size: savedSettings?.h3Size || 'text-xl',
  h4Size: savedSettings?.h4Size || 'text-lg',
  paragraphLeading: savedSettings?.paragraphLeading || 'leading-6',
  // Spacing
  elementSpacing: savedSettings?.elementSpacing || '*:my-2',
  // HR style
  hrBorderWidth: savedSettings?.hrBorderWidth || 'border-1'
})

// Apply saved settings on load
if (savedSettings) {
  appConfig.ui.colors.primary = savedSettings.primaryColor
  appConfig.ui.colors.neutral = savedSettings.neutralColor

  // Apply editor styles
  appConfig.ui.editor.slots.base = [
    `w-full outline-none ${settings.elementSpacing} *:first:mt-0 *:last:mb-0 sm:px-2 selection:bg-primary/20`,
    '[&_:is(p,h1,h2,h3,h4).is-empty]:before:content-[attr(data-placeholder)] [&_:is(p,h1,h2,h3,h4).is-empty]:before:text-dimmed [&_:is(p,h1,h2,h3,h4).is-empty]:before:float-left [&_:is(p,h1,h2,h3,h4).is-empty]:before:h-0 [&_:is(p,h1,h2,h3,h4).is-empty]:before:pointer-events-none',
    '[&_li_.is-empty]:before:content-none',
    `[&_p]:${settings.paragraphLeading} [&_p]:text-sm`,
    '[&_a]:text-primary [&_a]:border-b [&_a]:border-transparent [&_a]:hover:border-primary [&_a]:font-medium',
    '[&_a]:transition-colors',
    '[&_.mention]:text-primary [&_.mention]:font-medium',
    '[&_:is(h1,h2,h3,h4)]:text-highlighted [&_:is(h1,h2,h3,h4)]:font-bold',
    `[&_h1]:${settings.h1Size}`,
    `[&_h2]:${settings.h2Size}`,
    `[&_h3]:${settings.h3Size}`,
    `[&_h4]:${settings.h4Size}`,
    '[&_:is(h1,h2,h3,h4)>code]:border-dashed [&_:is(h1,h2,h3,h4)>code]:font-bold',
    '[&_h2>code]:text-xl/6',
    '[&_h3>code]:text-lg/5',
    '[&_blockquote]:border-s-4 [&_blockquote]:border-accented [&_blockquote]:ps-4 [&_blockquote]:italic',
    '[&_[data-type=horizontalRule]]:my-0 [&_[data-type=horizontalRule]]:py-0',
    `[&_hr]:border-t [&_hr]:border-black [&_hr]:${settings.hrBorderWidth}`,
    '[&_pre]:text-sm/6 [&_pre]:border [&_pre]:border-muted [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:px-4 [&_pre]:py-3 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-x-auto',
    '[&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:font-inherit [&_pre_code]:rounded-none [&_pre_code]:inline [&_pre_code]:border-0 [&_pre_code]:bg-transparent',
    '[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:font-medium [&_code]:rounded-md [&_code]:inline-block [&_code]:border [&_code]:border-muted [&_code]:text-highlighted [&_code]:bg-muted',
    '[&_:is(ul,ol)]:ps-6',
    '[&_ul]:list-disc [&_ul]:marker:text-(--ui-border-black)',
    '[&_ol]:list-decimal [&_ol]:marker:text-muted',
    '[&_li]:my-1.5 [&_li]:ps-1.5 [&_li]:text-sm',
    '[&_img]:rounded-md [&_img]:block [&_img]:max-w-full [&_img.ProseMirror-selectednode]:outline-2 [&_img.ProseMirror-selectednode]:outline-primary',
    '[&_.ProseMirror-selectednode:not(img):not(pre):not([data-node-view-wrapper])]:bg-primary/20'
  ]
}

// Save settings to localStorage and apply
const saveSettings = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }

  // Update colors
  appConfig.ui.colors.primary = settings.primaryColor
  appConfig.ui.colors.neutral = settings.neutralColor

  // Rebuild the entire base styles array with new settings
  appConfig.ui.editor.slots.base = [
    `w-full outline-none ${settings.elementSpacing} *:first:mt-0 *:last:mb-0 sm:px-2 selection:bg-primary/20`,
    '[&_:is(p,h1,h2,h3,h4).is-empty]:before:content-[attr(data-placeholder)] [&_:is(p,h1,h2,h3,h4).is-empty]:before:text-dimmed [&_:is(p,h1,h2,h3,h4).is-empty]:before:float-left [&_:is(p,h1,h2,h3,h4).is-empty]:before:h-0 [&_:is(p,h1,h2,h3,h4).is-empty]:before:pointer-events-none',
    '[&_li_.is-empty]:before:content-none',
    `[&_p]:${settings.paragraphLeading}`,
    '[&_a]:text-primary [&_a]:border-b [&_a]:border-transparent [&_a]:hover:border-primary [&_a]:font-medium',
    '[&_a]:transition-colors',
    '[&_.mention]:text-primary [&_.mention]:font-medium',
    '[&_:is(h1,h2,h3,h4)]:text-highlighted [&_:is(h1,h2,h3,h4)]:font-bold',
    `[&_h1]:${settings.h1Size}`,
    `[&_h2]:${settings.h2Size}`,
    `[&_h3]:${settings.h3Size}`,
    `[&_h4]:${settings.h4Size}`,
    '[&_:is(h1,h2,h3,h4)>code]:border-dashed [&_:is(h1,h2,h3,h4)>code]:font-bold',
    '[&_h2>code]:text-xl/6',
    '[&_h3>code]:text-lg/5',
    '[&_blockquote]:border-s-4 [&_blockquote]:border-accented [&_blockquote]:ps-4 [&_blockquote]:italic',
    '[&_[data-type=horizontalRule]]:my-0 [&_[data-type=horizontalRule]]:py-0',
    `[&_hr]:border-t [&_hr]:border-red-500 [&_hr]:${settings.hrBorderWidth}`,
    '[&_pre]:text-sm/6 [&_pre]:border [&_pre]:border-muted [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:px-4 [&_pre]:py-3 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-x-auto',
    '[&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:font-inherit [&_pre_code]:rounded-none [&_pre_code]:inline [&_pre_code]:border-0 [&_pre_code]:bg-transparent',
    '[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:font-medium [&_code]:rounded-md [&_code]:inline-block [&_code]:border [&_code]:border-muted [&_code]:text-highlighted [&_code]:bg-muted',
    '[&_:is(ul,ol)]:ps-6',
    '[&_ul]:list-disc [&_ul]:marker:text-(--ui-border-accented)',
    '[&_ol]:list-decimal [&_ol]:marker:text-muted',
    '[&_li]:my-1.5 [&_li]:ps-1.5',
    '[&_img]:rounded-md [&_img]:block [&_img]:max-w-full [&_img.ProseMirror-selectednode]:outline-2 [&_img.ProseMirror-selectednode]:outline-primary',
    '[&_.ProseMirror-selectednode:not(img):not(pre):not([data-node-view-wrapper])]:bg-primary/20'
  ]

  isSettingsOpen.value = false

  // Force a reload to apply changes
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}

const colorOptions = [
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'lime', label: 'Lime', class: 'bg-lime-500' },
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-500' },
  { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
  { value: 'sky', label: 'Sky', class: 'bg-sky-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'violet', label: 'Violet', class: 'bg-violet-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'fuchsia', label: 'Fuchsia', class: 'bg-fuchsia-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'rose', label: 'Rose', class: 'bg-rose-500' }
]

const neutralOptions = [
  { value: 'slate', label: 'Slate', class: 'bg-slate-500' },
  { value: 'gray', label: 'Gray', class: 'bg-gray-500' },
  { value: 'zinc', label: 'Zinc', class: 'bg-zinc-500' },
  { value: 'neutral', label: 'Neutral', class: 'bg-neutral-500' },
  { value: 'stone', label: 'Stone', class: 'bg-stone-500' }
]

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
        type: 'heading',
        attrs: {
          textAlign: 'center',
          level: 2
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'Shubham Gupta'
          }
        ]
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: 'center'
        },
        content: [
          {
            type: 'text',
            text: 'Email: shubhamedu.01@gmail.com'
          },
          {
            type: 'hardBreak'
          },
          {
            type: 'text',
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://shubhamgupta.dev/',
                  target: '_blank',
                  rel: 'noopener noreferrer nofollow',
                  class: null
                }
              }
            ],
            text: 'Website'
          },
          {
            type: 'text',
            text: ' | '
          },
          {
            type: 'text',
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://github.com/10shubham01/',
                  target: '_blank',
                  rel: 'noopener noreferrer nofollow',
                  class: null
                }
              }
            ],
            text: 'GitHub'
          },
          {
            type: 'text',
            text: ' | '
          },
          {
            type: 'text',
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://www.linkedin.com/in/shubhamgupta001/',
                  target: '_blank',
                  rel: 'noopener noreferrer nofollow',
                  class: null
                }
              }
            ],
            text: 'LinkedIn'
          },
          {
            type: 'text',
            text: ' | +91 9369745870'
          }
        ]
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: 'left'
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'PROFILE'
          },
          {
            type: 'hardBreak'
          },
          {
            type: 'text',
            text: 'Experienced Software Developer with a solid foundation in full-stack development. Proficient in JavaScript, TypeScript, Vue.js, React.js, Nuxt.js, Next.js, Node.js, and MySQL, committed to delivering impactful and results-focused solutions.'
          }
        ]
      },
      {
        type: 'horizontalRule'
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'SKILLS'
          },
          {
            type: 'hardBreak'
          },
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'Advanced Knowledge:'
          },
          {
            type: 'text',
            text: ' TypeScript, JavaScript, NodeJS, HTML, CSS, Tailwind, VueJS, NuxtJS, ReactJS, NextJS, AdonisJS, ExpressJS, PostgreSQL, MySQL, Git, Bash, Webpack, Vite, AWS, GitHub CI/CD.'
          },
          {
            type: 'hardBreak'
          },
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'Basic Knowledge:'
          },
          {
            type: 'text',
            text: ' C, C++, Java, Python'
          }
        ]
      },
      {
        type: 'horizontalRule'
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'EXPERIENCE'
          },
          {
            type: 'hardBreak'
          },
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'Senior Software Engineer'
          },
          {
            type: 'text',
            text: ': '
          },
          {
            type: 'text',
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://www.credilio.in/',
                  target: '_blank',
                  rel: 'noopener noreferrer nofollow',
                  class: null
                }
              }
            ],
            text: 'Credilio Financial Technologies'
          },
          {
            type: 'text',
            text: '                                        Dec 2022 -Present'
          }
        ]
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Led a team of engineers, conducted thorough code reviews to ensure quality assurance and mentored junior developers to enhance their technical skills and coding practices.'
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Successfully onboarded 5+ developers by providing comprehensive training, knowledge transfer, and ongoing support to accelerate their productivity.'
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Managed and optimized GitHub CI/CD pipelines for streamlined deployment processes on AWS infrastructure.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'KEY PROJECTS'
          }
        ]
      },
      {
        type: 'heading',
        attrs: {
          textAlign: null,
          level: 4
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'Customer Portal:'
          }
        ]
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Integrated bank APIs to streamline credit card and personal loan application journeys, enhancing user experience and operational efficiency. '
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Spearheaded a project restructuring initiative using composable components and industry best practices, improving code maintainability by 20% and enhancing accessibility. '
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Achieved significant page load time optimization through expertise in lifecycle hooks, rendering strategies, asynchronous components, virtual scrolling, debouncing, and throttling.'
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: ' Designed a customizable portal enabling partners to personalize colors, logos, fonts, and backgrounds for seamless branding integration. '
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Utilized validation libraries like Zod, Yup, and Vee-Validate to enforce robust input validation across projects.'
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Maintained code quality with tools like ESLint, Prettier, and advanced Vite configurations for efficient client-side asset bundling.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'heading',
        attrs: {
          textAlign: null,
          level: 4
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'Advisor Portal:'
          }
        ]
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Developed fully accessible and reusable components such as file uploads and text inputs with validation and sanitization.'
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Implemented lead, customer, and earnings report generation with secure file downloads. '
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Integrated web-based landing and library pages into native apps (Credilio Pro).'
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Designed persistent, session-based authentication and authorization systems using JWT, adhering to best security practices.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'heading',
        attrs: {
          textAlign: null,
          level: 4
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'Plug and Play:'
          }
        ]
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Delivered dynamic theme support for seamless adaptation to partner platforms with native features like image/text sharing and clipboard access.'
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Facilitated communication between Android/iOS apps and WebView in a single-page application (SPA). '
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Guided partner developers in integrating the web platform into their native applications, leading a team of 3-4 developers.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'heading',
        attrs: {
          textAlign: null,
          level: 4
        },
        content: [
          {
            type: 'text',
            text: 'Admin Portal:'
          }
        ]
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Engineered user access management systems based on roles and policies to restrict unauthorized access effectively.'
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Developed robust CSV-based report creation and file download functionalities tailored for administrative use.'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'Techstack:'
          },
          {
            type: 'text',
            text: ' Vue, Nuxt, Vuetify, SCSS, Nuxt UI, JWT, Validations, Tailwind, Github actions (CI/CD)'
          }
        ]
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        }
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'Software Engineer/Trainee:'
          },
          {
            type: 'text',
            text: ' '
          },
          {
            type: 'text',
            marks: [
              {
                type: 'link',
                attrs: {
                  href: 'https://www.mountblue.io/',
                  target: '_blank',
                  rel: 'noopener noreferrer nofollow',
                  class: null
                }
              }
            ],
            text: 'Mountblue'
          },
          {
            type: 'text',
            text: '                                                                               Aug 2021 – Nov 2022'
          }
        ]
      },
      {
        type: 'bulletList',
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Front-End and Back-End Development: Built dynamic web applications using Vue.js, React.js, and Node.js, delivering robust APIs and database connections with Express.js and PostgreSQL/MySQL. '
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Full-Stack Consulting for Credilio Financial Technologies'
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Adaptability and Research: Regularly researched and adopted new frameworks, libraries, and tools to maintain up-to-date tech stacks and improve application performance and maintainability. '
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Problem Solving and Quality Assurance: Delivered high-quality code with a strong focus on troubleshooting, debugging, and ensuring reliable, secure applications through code reviews and best practices from training. '
                  }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                attrs: {
                  textAlign: null
                },
                content: [
                  {
                    type: 'text',
                    text: 'Successfully migrated a Nuxt 2 project to Nuxt 3, implementing a scalable architecture and optimising performance for improved efficiency and maintainability'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'TechStack'
          },
          {
            type: 'text',
            text: ': Vue2, Nuxt2, ReactJS, TypeScript, ExpressJs , AdonisJs,'
          }
        ]
      },
      {
        type: 'horizontalRule'
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'EDUCATION                                                                                                                                                                                     '
          }
        ]
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        },
        content: [
          {
            type: 'text',
            marks: [
              {
                type: 'bold'
              }
            ],
            text: 'Lovely Professional University                                                                                                                          '
          },
          {
            type: 'text',
            text: '2018-2021'
          }
        ]
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        },
        content: [
          {
            type: 'text',
            text: 'Bachelor of Computer Applications'
          }
        ]
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        },
        content: [
          {
            type: 'text',
            text: 'Undergraduate Coursework: Operating Systems, Databases, C,'
          }
        ]
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        },
        content: [
          {
            type: 'text',
            text: 'C++, HTML5, CSS, Ionic, React Native'
          }
        ]
      },
      {
        type: 'paragraph',
        attrs: {
          textAlign: null
        }
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
  const defaultFilename = `editor-content-${new Date().toISOString().split('T')[0]}`
  const filename = window.prompt('Enter filename (without .json extension):', defaultFilename)

  if (!filename) return

  const dataStr = JSON.stringify(content.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.json`
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
    <!-- Watermark -->
    <div
      v-if="!hideWatermark"
      class="hidden print:flex fixed inset-0 pointer-events-none z-10 items-center justify-center"
    >
      <div
        class="text-[8rem] font-bold text-neutral-400/40 select-none whitespace-nowrap"
        style="transform: rotate(-45deg);"
      >
        resume.shubham.gupta
      </div>
    </div>

    <!-- Export/Import/Settings Controls -->
    <div class="fixed top-4 right-4 z-50 flex gap-2 print:hidden">
      <UButton
        icon="i-lucide-settings"
        color="neutral"
        variant="soft"
        size="sm"
        label="Settings"
        @click="isSettingsOpen = true"
      />
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

    <!-- Settings Modal -->
    <UModal v-model:open="isSettingsOpen">
      <UButton
        icon="i-lucide-settings"
        color="neutral"
        variant="subtle"
        label="Settings"
        class="hidden"
      />

      <template #header>
        <h3 class="text-lg font-semibold">
          Customize Editor
        </h3>
      </template>

      <template #body>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Colors Section -->
          <div class="lg:col-span-2">
            <h4 class="text-sm font-semibold mb-3">
              Colors
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField
                label="Primary Color"
                help="Main accent color for the editor"
              >
                <USelectMenu
                  v-model="settings.primaryColor"
                  class="w-full"
                  :items="colorOptions"
                  value-key="value"
                >
                  <template #item-leading="{ item }">
                    <span :class="[item.class, 'size-4']" />
                  </template>
                  <template #leading>
                    <span
                      :class="[
                        colorOptions.find(c => c.value === settings.primaryColor)?.class,
                        'size-4'
                      ]"
                    />
                  </template>
                </USelectMenu>
              </UFormField>

              <UFormField
                label="Neutral Color"
                help="Background and text color scheme"
              >
                <USelectMenu
                  v-model="settings.neutralColor"
                  class="w-full"
                  :items="neutralOptions"
                  value-key="value"
                >
                  <template #item-leading="{ item }">
                    <span :class="[item.class, 'size-4']" />
                  </template>
                  <template #leading>
                    <span
                      :class="[
                        neutralOptions.find(c => c.value === settings.neutralColor)?.class,
                        'size-4'
                      ]"
                    />
                  </template>
                </USelectMenu>
              </UFormField>
            </div>
          </div>

          <!-- Typography Section -->
          <div>
            <h4 class="text-sm font-semibold mb-3">
              Typography
            </h4>
            <div class="space-y-4">
              <UFormField label="Heading 1 Size">
                <USelectMenu
                  v-model="settings.h1Size"
                  class="w-full"
                  :items="[
                    { value: 'text-2xl', label: '2xl' },
                    { value: 'text-3xl', label: '3xl (Default)' },
                    { value: 'text-4xl', label: '4xl' },
                    { value: 'text-5xl', label: '5xl' }
                  ]"
                  value-key="value"
                />
              </UFormField>

              <UFormField label="Heading 2 Size">
                <USelectMenu
                  v-model="settings.h2Size"
                  class="w-full"
                  :items="[
                    { value: 'text-xl', label: 'xl' },
                    { value: 'text-2xl', label: '2xl (Default)' },
                    { value: 'text-3xl', label: '3xl' },
                    { value: 'text-4xl', label: '4xl' }
                  ]"
                  value-key="value"
                />
              </UFormField>

              <UFormField label="Heading 3 Size">
                <USelectMenu
                  v-model="settings.h3Size"
                  class="w-full"
                  :items="[
                    { value: 'text-lg', label: 'lg' },
                    { value: 'text-xl', label: 'xl (Default)' },
                    { value: 'text-2xl', label: '2xl' },
                    { value: 'text-3xl', label: '3xl' }
                  ]"
                  value-key="value"
                />
              </UFormField>

              <UFormField label="Heading 4 Size">
                <USelectMenu
                  v-model="settings.h4Size"
                  class="w-full"
                  :items="[
                    { value: 'text-base', label: 'base' },
                    { value: 'text-lg', label: 'lg (Default)' },
                    { value: 'text-xl', label: 'xl' },
                    { value: 'text-2xl', label: '2xl' }
                  ]"
                  value-key="value"
                />
              </UFormField>

              <UFormField label="Paragraph Line Height">
                <USelectMenu
                  v-model="settings.paragraphLeading"
                  class="w-full"
                  :items="[
                    { value: 'leading-5', label: 'Tight (5)' },
                    { value: 'leading-6', label: 'Normal (6 - Default)' },
                    { value: 'leading-7', label: 'Relaxed (7)' },
                    { value: 'leading-8', label: 'Loose (8)' }
                  ]"
                  value-key="value"
                />
              </UFormField>
            </div>
          </div>

          <!-- Spacing & Layout Section -->
          <div>
            <h4 class="text-sm font-semibold mb-3">
              Spacing & Layout
            </h4>
            <div class="space-y-4">
              <UFormField label="Element Spacing">
                <USelectMenu
                  v-model="settings.elementSpacing"
                  class="w-full"
                  :items="[
                    { value: '*:my-1', label: 'Tight (1)' },
                    { value: '*:my-2', label: 'Normal (2 - Default)' },
                    { value: '*:my-3', label: 'Relaxed (3)' },
                    { value: '*:my-4', label: 'Loose (4)' }
                  ]"
                  value-key="value"
                />
              </UFormField>

              <UFormField label="Horizontal Rule Border">
                <USelectMenu
                  v-model="settings.hrBorderWidth"
                  class="w-full"
                  :items="[
                    { value: 'border-1', label: 'Thin (1 - Default)' },
                    { value: 'border-2', label: 'Medium (2)' },
                    { value: 'border-4', label: 'Thick (4)' }
                  ]"
                  value-key="value"
                />
              </UFormField>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancel"
            @click="isSettingsOpen = false"
          />
          <UButton
            label="Save Settings"
            @click="saveSettings"
          />
        </div>
      </template>
    </UModal>

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
        base: '',
        content: 'max-w-[210mm] mx-auto p-[10mm] print:p-0'
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
