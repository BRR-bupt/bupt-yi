<template>
  <el-menu class="el-menu-demo" mode="horizontal">
    <el-menu-item index="1">
      <el-icon><arrow-down-bold /></el-icon>
    </el-menu-item>

    <el-menu-item index="2" @click="emit('openRenderer')" style="margin-left: 82vw">
      <el-icon><video-camera /></el-icon>
    </el-menu-item>
    <el-menu-item index="3" @click="SettingDialog = true">
      <el-icon><setting /></el-icon>
    </el-menu-item>
    <el-menu-item index="4" @click="AboutDialog = true">
      <el-icon><warning /></el-icon>
    </el-menu-item>
  </el-menu>

  <AboutModel v-model:dialogVisible="AboutDialog" />
  <ProjectSetting v-model:dialogVisible="SettingDialog" />
</template>

<script setup lang="ts">
import { ArrowDownBold, Setting, VideoCamera, Warning } from '@element-plus/icons-vue'
const AboutDialog = ref(false)
const SettingDialog = ref(false)

const emit = defineEmits<{
  (e: 'openRenderer'): void
}>()
</script>

<style scoped>
.app-bar {
  display: flex;
}
</style>
