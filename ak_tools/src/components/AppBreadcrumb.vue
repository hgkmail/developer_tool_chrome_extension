<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

interface BreadcrumbItem {
    title: string
    path?: string | null
}

const items = computed<BreadcrumbItem[]>(() => {
    const crumbs: BreadcrumbItem[] = [{ title: t('breadcrumb.home'), path: '/' }]

    // Inject parent segments from meta (e.g. [{ title: 'JSON', path: null }])
    const parents = route.meta?.parentBreadcrumbs as BreadcrumbItem[] | undefined
    if (parents) {
        for (const p of parents) {
            crumbs.push({ title: p.title, path: p.path ?? null })
        }
    }

    // Current page breadcrumb
    if (route.meta?.breadcrumb) {
        crumbs.push({ title: route.meta.breadcrumb as string })
    }

    return crumbs
})
</script>

<template>
    <el-breadcrumb separator="/" class="app-breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in items" :key="index">
            <span v-if="item.path && index < items.length - 1" class="breadcrumb-link"
                @click="router.push(item.path)">{{ item.title }}</span>
            <span v-else>{{ item.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<style scoped>
.app-breadcrumb {
    font-size: 13px;
}

.breadcrumb-link {
    cursor: pointer;
    color: var(--el-text-color-regular);
    transition: color 0.2s;
}

.breadcrumb-link:hover {
    color: var(--el-color-primary);
}
</style>
