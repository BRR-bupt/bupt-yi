<template>
  <h2>Image</h2>
  <el-form label-width="50px" size="small">
    <el-form-item label="Asset">
      <Select :items="getSelectItems" :id="currentAssetId" @change="changeAsset" />
    </el-form-item>
    <el-form-item label="Start">
      <el-input-number :precision="3" v-model="strip.start" />
    </el-form-item>
    <el-form-item label="Length">
      <el-input-number :precision="3" v-model="strip.length" />
    </el-form-item>
    <el-form-item label="Pos-X">
      <el-input-number v-model="strip.position.x" />
    </el-form-item>
    <el-form-item label="Pos-Y">
      <el-input-number v-model="strip.position.y" />
    </el-form-item>
    <el-form-item label="Percent (%)">
      <el-input-number v-model="strip.percent" :step="10" @change="strip.fixPercent(strip.percent)" />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { Asset, ImageStrip, ImageAsset } from '../../models'
import { OptionKeyValue } from '../widget/Select.vue'
const props = defineProps<{
  strip: ImageStrip
  assets: Asset[]
}>()

const getImageAsset = computed((): ImageAsset[] => {
  return props.assets.filter(item => item instanceof ImageAsset) as ImageAsset[]
})
const getSelectItems = computed(() => {
  const items: OptionKeyValue[] = [{ value: '', text: 'No selected', disabled: true }]
  return items.concat(
    getImageAsset.value.map((va: ImageAsset) => {
      return {
        value: va.id,
        text: va.name
      }
    })
  )
})
const currentAssetId = computed(() => {
  if (props.strip.imageAsset) {
    return props.strip.imageAsset.id
  }
  return ''
})

const changeAsset = (val: OptionKeyValue | undefined) => {
  if (val) {
    const target = props.assets.find(item => item.id === val.value)
    if (!target || !(target instanceof ImageAsset)) return
    props.strip.updateAsset(target)
    console.log(props.strip)
  }
}
</script>

<style scoped></style>
