<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { TOOL_LIST, useToolsStore } from '@/stores/tools'
import type { ToolMeta } from '@/stores/tools'

const { t } = useI18n()
const router = useRouter()
const toolsStore = useToolsStore()

const searchQuery = ref('')

// Group tools by category
const CATEGORIES = [
  { key: 'json', labelKey: 'nav.json' },
  { key: 'date', labelKey: 'nav.date' },
  { key: 'format', labelKey: 'nav.format' },
]

const filteredTools = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return TOOL_LIST
  return TOOL_LIST.filter((tool) => t(tool.nameKey).toLowerCase().includes(q))
})

const groupedTools = computed(() => {
  return CATEGORIES.map((cat) => ({
    key: cat.key,
    label: t(cat.labelKey),
    tools: filteredTools.value.filter((tool) => tool.category === cat.key),
  })).filter((g) => g.tools.length > 0)
})

function openTool(tool: ToolMeta) {
  toolsStore.recordUsage(tool.key)
  router.push(tool.path)
}
</script>

<template>
  <div class="home-page">
    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat-info">
        <div class="stat-label">{{ TOOL_LIST.length }}{{ t('home.totalTools') }}</div>
      </div>
    </div>

    <!-- Search -->
    <div class="search-row">
      <el-input v-model="searchQuery" :placeholder="t('home.searchPlaceholder')" clearable size="large"
        class="search-input" prefix-icon="Search" />
    </div>

    <!-- Recently used -->
    <template v-if="!searchQuery && toolsStore.recentTools.length">
      <div class="section-title">{{ t('home.recentlyUsed') }}</div>
      <div class="tool-grid recent-grid">
        <el-card v-for="tool in toolsStore.recentTools" :key="tool.key" class="tool-card" shadow="hover"
          @click="openTool(tool)">
          <div class="tool-card-inner">
            <el-icon :size="28" class="tool-icon">
              <component :is="tool.icon" />
            </el-icon>
            <div class="tool-info">
              <div class="tool-name">{{ t(tool.nameKey) }}</div>
              <div class="tool-desc">{{ t(tool.descKey) }}</div>
            </div>
            <el-icon class="tool-arrow">
              <ArrowRight />
            </el-icon>
          </div>
        </el-card>
      </div>
    </template>

    <!-- All tools by category -->
    <template v-if="groupedTools.length">
      <template v-for="group in groupedTools" :key="group.key">
        <div class="section-title">{{ group.label }}</div>
        <div class="tool-grid">
          <el-card v-for="tool in group.tools" :key="tool.key" class="tool-card" shadow="hover" @click="openTool(tool)">
            <div class="tool-card-inner">
              <el-icon :size="28" class="tool-icon">
                <component :is="tool.icon" />
              </el-icon>
              <div class="tool-info">
                <div class="tool-name">{{ t(tool.nameKey) }}</div>
                <div class="tool-desc">{{ t(tool.descKey) }}</div>
              </div>
              <el-icon class="tool-arrow">
                <ArrowRight />
              </el-icon>
            </div>
          </el-card>
        </div>
      </template>
    </template>

    <!-- Empty state when search has no results -->
    <el-empty v-else-if="searchQuery" :description="t('home.noSearchResult')" />
  </div>
</template>

<style scoped>
.home-page {
  padding: 20px;
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-label {
  font-size: 15px;
  color: var(--el-text-color-regular);
  margin-top: 4px;
}

.search-row {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.search-input {
  max-width: 480px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 12px;
  margin-top: 4px;
  padding-left: 4px;
  border-left: 3px solid var(--el-color-primary);
  padding-left: 10px;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
}

.recent-grid {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.tool-card {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.tool-card:hover {
  transform: translateY(-2px);
}

.tool-card-inner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tool-icon {
  color: var(--el-color-primary);
  flex-shrink: 0;
}

.tool-info {
  flex: 1;
  min-width: 0;
}

.tool-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-arrow {
  color: var(--el-text-color-placeholder);
  flex-shrink: 0;
  transition: color 0.2s;
}

.tool-card:hover .tool-arrow {
  color: var(--el-color-primary);
}
</style>
