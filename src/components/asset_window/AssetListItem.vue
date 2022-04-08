<template>
  <div @click="emit('select-asset')" :style="getStyle">
    {{ asset.name }}
  </div>
  <hr />
</template>

<script setup lang="ts">
import { StyleValue } from 'vue'
import { Asset } from '../../models'
const props = defineProps<{
  asset: Asset
  selected: boolean
}>()
const getStyle = computed((): StyleValue => {
  if (props.selected)
    return {
      // backgroundColor: 'yellow',
      color: 'green',
      cursor: 'pointer'
    }
  return {
    cursor: 'pointer'
  }
})

const emit = defineEmits<{
  (e: 'select-asset'): void
}>()
// const handleMouse = (e: MouseEvent) => {
//   if (e.button === 0) {
//     emit('select-asset')
//   }
//   if (e.button === 2) {
//     console.log('delete')
//   }
// }
</script>

<style scoped></style>
