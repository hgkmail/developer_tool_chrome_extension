<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useToolsStore } from '@/stores/tools'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const toolsStore = useToolsStore()

// Get tool name from route meta
const toolName = computed(() => (route.meta?.title as string | undefined) ?? t('tool.wip'))

onMounted(() => {
  // Record usage when visiting a tool page
  const toolKey = route.meta?.toolKey as string | undefined
  if (toolKey) toolsStore.recordUsage(toolKey)
})
</script>

<template>
  <div class="tool-placeholder">
    <el-result icon="info" :title="toolName" :sub-title="t('tool.wipDesc')">
      <template #icon>
        <el-icon :size="64" class="wip-icon">
          <Tools />
        </el-icon>
      </template>
      <template #extra>
        <el-button type="primary" @click="router.push('/')">
          <el-icon>
            <HomeFilled />
          </el-icon>
          {{ t('tool.backHome') }}
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<style scoped>
.tool-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 20px;
}

.wip-icon {
  color: var(--el-color-primary);
}
</style>
