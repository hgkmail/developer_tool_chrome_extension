<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppBreadcrumb from '@/components/AppBreadcrumb.vue'
import SettingsDrawer from '@/components/SettingsDrawer.vue'
import FloatingButtons from '@/components/FloatingButtons.vue'

const settingsVisible = ref(false)
</script>

<template>
  <el-container class="admin-root" direction="vertical">
    <!-- Header -->
    <AppHeader />

    <!-- Body -->
    <el-container class="admin-body">
      <!-- Sidebar -->
      <AppSidebar />

      <!-- Main content -->
      <el-main class="admin-main">
        <!-- Breadcrumb -->
        <div class="breadcrumb-bar">
          <AppBreadcrumb />
        </div>

        <!-- Page content -->
        <div class="page-content">
          <el-scrollbar class="page-scrollbar" :always="true">
            <router-view />
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>

    <!-- Floating buttons -->
    <FloatingButtons @open-settings="settingsVisible = true" />

    <!-- Settings drawer -->
    <SettingsDrawer v-model:visible="settingsVisible" />
  </el-container>
</template>

<style scoped lang="scss">
.admin-root {
  min-height: 100vh;
  background-color: var(--el-bg-color-page);
}

.admin-body {
  flex: 1;
  overflow: hidden;
}

.admin-main {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background-color: var(--el-bg-color-page);
}

.breadcrumb-bar {
  padding: 0px 24px;
  height: $breadcrumb-bar-height;
  display: flex;
  align-items: center;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-lighter);
  position: sticky;
  top: 0;
  z-index: 10;
}

.page-scrollbar {
  height: calc(100vh - #{$app-header-height} - #{$breadcrumb-bar-height});
}
</style>
