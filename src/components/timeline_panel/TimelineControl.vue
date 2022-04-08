<template>
  <el-button :icon="VideoPlay" size="default" circle v-if="!store.isPlay" @click="store.isPlay = !store.isPlay" />
  <el-button :icon="VideoPause" size="default" circle v-else @click="store.isPlay = !store.isPlay" />
  <div style="margin-left: 90vw">
    <el-button :icon="ZoomIn" size="default" circle @click="emit('up-scale')" />
    <el-button :icon="ZoomOut" size="default" circle @click="emit('down-scale')" />
  </div>
</template>

<script setup lang="ts">
import { VideoPlay, VideoPause, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import { useStore } from '../../store/project'
const store = useStore()

const emit = defineEmits<{
  (e: 'up-scale'): void
  (e: 'down-scale'): void
}>()
</script>

<style scoped></style>
