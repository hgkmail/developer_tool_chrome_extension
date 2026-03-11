<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Fuse from 'fuse.js'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const collapsed = ref(false)
const searchQuery = ref('')

interface MenuLeaf {
  key: string
  label: string
  path: string
  icon: string
}
interface MenuHome {
  type: 'home'
  key: string
  label: string
  path: string
  icon: string
}
interface MenuGroup {
  type: 'group'
  key: string
  label: string
  icon: string
  children: MenuLeaf[]
}
type MenuItem = MenuHome | MenuGroup

const menuData = computed<MenuItem[]>(() => [
  { type: 'home', key: 'home', label: t('nav.home'), path: '/', icon: 'HomeFilled' },
  {
    type: 'group',
    key: 'json',
    label: t('nav.json'),
    icon: 'Memo',
    children: [
      { key: 'jsonFormat', label: t('nav.jsonFormat'), path: '/json/format', icon: 'Memo' },
      { key: 'jsonEscape', label: t('nav.jsonEscape'), path: '/json/escape', icon: 'EditPen' },
      { key: 'jsonEntity', label: t('nav.jsonEntity'), path: '/json/entity', icon: 'Files' },
    ],
  },
  {
    type: 'group',
    key: 'date',
    label: t('nav.date'),
    icon: 'Calendar',
    children: [
      {
        key: 'dateTimestamp',
        label: t('nav.dateTimestamp'),
        path: '/date/timestamp',
        icon: 'Timer',
      },
      { key: 'dateCron', label: t('nav.dateCron'), path: '/date/cron', icon: 'Calendar' },
    ],
  },
  {
    type: 'group',
    key: 'format',
    label: t('nav.format'),
    icon: 'MagicStick',
    children: [
      { key: 'formatHtml', label: t('nav.formatHtml'), path: '/format/html', icon: 'Document' },
      {
        key: 'formatJs',
        label: t('nav.formatJs'),
        path: '/format/javascript',
        icon: 'Cpu',
      },
      { key: 'formatCss', label: t('nav.formatCss'), path: '/format/css', icon: 'MagicStick' },
      { key: 'formatSql', label: t('nav.formatSql'), path: '/format/sql', icon: 'DataLine' },
    ],
  },
])

// Flatten leaves for Fuse search
const allLeaves = computed(() => {
  const leaves: MenuLeaf[] = []
  for (const item of menuData.value) {
    if (item.type === 'home') {
      leaves.push({ key: item.key, label: item.label, path: item.path, icon: item.icon })
    } else if ('children' in item) {
      leaves.push(...item.children)
    }
  }
  return leaves
})

const fuse = computed(
  () =>
    new Fuse(allLeaves.value, {
      keys: ['label'],
      threshold: 0.4,
      includeScore: true,
    }),
)

const filteredMenu = computed<MenuItem[]>(() => {
  const q = searchQuery.value.trim()
  if (!q) return menuData.value

  const results = fuse.value.search(q).map((r) => r.item)
  const matchedKeys = new Set(results.map((r) => r.key))

  const filtered: MenuItem[] = []
  for (const item of menuData.value) {
    if (item.type === 'home') {
      if (matchedKeys.has(item.key)) filtered.push(item)
    } else {
      const matchedChildren = item.children.filter((c) => matchedKeys.has(c.key))
      if (matchedChildren.length) {
        filtered.push({ ...item, children: matchedChildren })
      }
    }
  }
  return filtered
})

const autoOpen = useDebounceFn((q) => {
  if (q) {
    for (const item of filteredMenu.value) {
      if (item.type === 'group') {
        menuRef.value?.open(item.key)
      }
    }
  }
}, 300)

// 搜索时默认展开所有非叶子节点，方便展示匹配结果
const menuRef = useTemplateRef('menu-ref')
watch(searchQuery, (newVal) => {
  autoOpen(newVal.trim())
})

function navigate(path: string) {
  router.push(path)
}

const activeIndex = computed(() => route.path)

const sidebarWidth = computed(() => (collapsed.value ? '64px' : '220px'))
</script>

<template>
  <el-aside class="app-sidebar" :width="sidebarWidth">
    <div class="sidebar-inner">
      <!-- Search input (hidden when collapsed) -->
      <div v-if="!collapsed" class="sidebar-search">
        <el-input v-model="searchQuery" :placeholder="t('sidebar.search')" clearable size="small"
          prefix-icon="Search" />
      </div>

      <!-- Menu -->
      <el-scrollbar class="menu-scrollbar" :always="true">
        <el-menu :collapse="collapsed" :default-active="activeIndex" :collapse-transition="false" class="sidebar-menu"
          background-color="transparent" ref="menu-ref">
          <template v-for="item in filteredMenu" :key="item.key">
            <!-- Home (flat item) -->
            <el-menu-item v-if="item.type === 'home'" index="/" @click="navigate('/')">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <template #title>{{ item.label }}</template>
            </el-menu-item>

            <!-- Sub menu group -->
            <el-sub-menu v-else :index="item.key">
              <template #title>
                <el-icon>
                  <component :is="item.icon" />
                </el-icon>
                <span>{{ item.label }}</span>
              </template>
              <el-menu-item v-for="child in item.children" :key="child.key" :index="child.path"
                @click="navigate(child.path)">
                <el-icon>
                  <component :is="child.icon" />
                </el-icon>
                <template #title>{{ child.label }}</template>
              </el-menu-item>
            </el-sub-menu>
          </template>
        </el-menu>
      </el-scrollbar>

      <!-- Collapse toggle button at bottom -->
      <div class="collapse-btn" @click="collapsed = !collapsed">
        <el-icon>
          <Fold v-if="!collapsed" />
          <Expand v-else />
        </el-icon>
        <span v-if="!collapsed" class="collapse-label">{{ t('sidebar.collapse') }}</span>
      </div>
    </div>
  </el-aside>
</template>

<style scoped lang="scss">
.app-sidebar {
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-light);
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  overflow: hidden;
  height: calc(100vh - #{$app-header-height});
}

.sidebar-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-search {
  padding: 12px 12px 4px;
  flex-shrink: 0;
}

.menu-scrollbar {
  flex: 1;
  overflow: hidden;
}

.sidebar-menu {
  border-right: none;
  background-color: transparent !important;
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  color: var(--el-text-color-regular);
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9) !important;
}

.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: var(--el-fill-color-light) !important;
}

.collapse-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  border-top: 1px solid var(--el-border-color-light);
  flex-shrink: 0;
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
}

.collapse-btn:hover {
  color: var(--el-color-primary);
}

.collapse-label {
  font-size: 13px;
}
</style>
