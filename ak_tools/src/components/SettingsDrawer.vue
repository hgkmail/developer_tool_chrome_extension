<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from '@/stores/settings'
import type { Theme, Language } from '@/stores/settings'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{ (e: 'update:visible', v: boolean): void }>()

const { t, locale } = useI18n()
const settings = useSettingsStore()

const drawerVisible = computed({
    get: () => props.visible,
    set: (v) => emit('update:visible', v),
})

const themeOptions = computed<{ label: string; value: Theme }[]>(() => [
    { label: t('setting.themeLight'), value: 'light' },
    { label: t('setting.themeDark'), value: 'dark' },
    { label: t('setting.themeSystem'), value: 'system' },
])

const langOptions = computed<{ label: string; value: Language }[]>(() => [
    { label: t('setting.langZhCN'), value: 'zhCN' },
    { label: t('setting.langEnUS'), value: 'enUS' },
])

function onLangChange(val: Language) {
    settings.language = val
    locale.value = val
}
</script>

<template>
    <el-drawer v-model="drawerVisible" :title="t('setting.title')" direction="rtl" size="320px" destroy-on-close>
        <div class="settings-content">
            <!-- Theme section -->
            <div class="settings-section">
                <div class="section-label">{{ t('setting.theme') }}</div>
                <el-radio-group v-model="settings.theme" class="theme-radio-group">
                    <el-radio-button v-for="opt in themeOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                    </el-radio-button>
                </el-radio-group>
            </div>

            <!-- Language section -->
            <div class="settings-section">
                <div class="section-label">{{ t('setting.language') }}</div>
                <el-select :model-value="settings.language" @update:model-value="onLangChange" style="width: 100%">
                    <el-option v-for="opt in langOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
            </div>
        </div>
    </el-drawer>
</template>

<style scoped>
.settings-content {
    padding: 8px 0;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.settings-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.section-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
}

.theme-radio-group {
    width: 100%;
    display: flex;
}

.theme-radio-group :deep(.el-radio-button) {
    flex: 1;
}

.theme-radio-group :deep(.el-radio-button__inner) {
    width: 100%;
}
</style>
