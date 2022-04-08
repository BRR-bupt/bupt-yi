<template>
  <h2>Text</h2>
  <el-form label-width="50px" size="small">
    <el-form-item label="Text">
      <el-input v-model="strip.text" />
    </el-form-item>
    <el-form-item label="Start">
      <el-input-number v-model="strip.start" />
    </el-form-item>
    <el-form-item label="Length">
      <el-input-number v-model="strip.length" />
    </el-form-item>
    <el-form-item label="Pos-X">
      <el-input-number v-model="strip.position.x" />
    </el-form-item>
    <el-form-item label="Pos-Y">
      <el-input-number v-model="strip.position.y" />
    </el-form-item>
    <el-form-item label="Family">
      <el-input v-model="strip.fontFamily" />
    </el-form-item>
    <el-form-item label="Style">
      <el-input v-model="strip.fontStyle" />
    </el-form-item>
    <el-form-item label="Size">
      <el-input-number v-model="strip.fontSize" />
    </el-form-item>
    <el-form-item label="color">
      <el-input v-model="strip.color" />
    </el-form-item>
    <el-form-item label="Shadow Color">
      <el-input v-model="strip.shadowColor" />
    </el-form-item>
    <el-form-item label="Shadow Blur">
      <el-input-number v-model="strip.shadowBlur" />
    </el-form-item>
    <el-form-item label="Outline color">
      <el-input v-model="strip.outlineColor" />
    </el-form-item>
    <el-form-item label="Outline Size">
      <el-input-number v-model="strip.outlineSize" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { Asset, TextStrip } from '../../models'

const props = defineProps<{
  strip: TextStrip
  assets: Asset[]
}>()
</script>

<style scoped></style>
