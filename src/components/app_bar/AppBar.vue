<template>
  <div class="appbar-font">BUPT-易剪辑</div>
  <div class="appbar-control">
    <el-button type="success" round @click="emit('openRenderer')">渲染导出</el-button>
    <el-button type="text" @click="SettingDialog = true" style="margin: 0 20px 0 30px">项目设置</el-button>
    <el-button type="text" @click="AboutDialog = true">关 于</el-button>
  </div>
  <!-- <el-menu class="el-menu-demo" mode="horizontal">
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
  </el-menu> -->

  <AboutModel v-model:dialogVisible="AboutDialog" />
  <ProjectSetting v-model:dialogVisible="SettingDialog" />
</template>

<script setup lang="ts">
const AboutDialog = ref(false)
const SettingDialog = ref(false)

const emit = defineEmits<{
  (e: 'openRenderer'): void
}>()
</script>

<style scoped>
.appbar-font {
  margin-top: 5px;
  margin-left: 20px;
  font-size: 22px;
}
.appbar-control {
  position: absolute;
  right: 30px;
  top: 5px;
}
</style>
