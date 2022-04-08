<template>
  <div class="strip-menu" v-if="isOpen" :style="GetMenuStyle">
    <div v-for="(item, i) in items" :key="i">
      <el-button type="text" size="small" @click="e => handleAction(e, item)">{{ item.text }}</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StyleValue } from 'vue'
import { useStore } from '../../store/project'
const store = useStore()
class ContextMenuItem {
  text: string = ''
  action: () => void = () => {}
}
const items = computed(() => {
  const items: ContextMenuItem[] = [
    { text: 'Add Text', action: store.addTextStrip },
    { text: 'Add Video', action: store.addVideoStrip },
    { text: 'Add Image', action: store.addImageStrip },
    { text: 'Add Audio', action: store.addAudioStrip }
  ]
  if (store.selectedStrip) {
    items.push({ text: 'Split', action: store.split })
    items.push({ text: 'Delete', action: store.deleteStrip })
  }
  return items
})

const x = ref(0)
const y = ref(0)
const isOpen = ref(false)
const open = (e: MouseEvent) => {
  x.value = e.pageX
  y.value = e.pageY
  isOpen.value = true
  console.log('openMenu')
}
defineExpose({
  open,
  isOpen
})

const GetMenuStyle = computed((): StyleValue => {
  return {
    left: x.value + 'px',
    top: y.value + 'px'
  }
})

const handleAction = (e: Event, item: ContextMenuItem) => {
  item.action()
  isOpen.value = false
}
</script>

<style scoped>
.strip-menu {
  position: fixed;
  background-color: #c8e0d9;
}
</style>
