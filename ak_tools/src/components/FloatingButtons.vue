<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { Top, Setting } from '@element-plus/icons-vue'

const emit = defineEmits<{ (e: 'openSettings'): void }>()

const { y: scrollY } = useWindowScroll()

const showBackTop = computed(() => scrollY.value > 200)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="floating-buttons">
    <!-- Back to top -->
    <transition name="fade">
      <el-button v-if="showBackTop" :icon="Top" type="success" circle class="float-btn" @click="scrollToTop">
      </el-button>
    </transition>

    <!-- Settings -->
    <el-button type="primary" :icon="Setting" circle class="float-btn" @click="emit('openSettings')">
    </el-button>
  </div>
</template>

<style scoped>
.floating-buttons {
  position: fixed;
  right: 24px;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 999;
}

.float-btn {
  width: 44px !important;
  height: 44px !important;
  box-shadow: var(--el-box-shadow-light);
  margin-left: 0px !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
