import { defineStore } from 'pinia'
import {
  _VERSION_,
  Strip,
  AudioAsset,
  Asset,
  AudioStrip,
  TextStrip,
  VideoAsset,
  VideoStrip,
  ImageStrip,
  ImageAsset
} from '../models'
import { Project } from '../models/Project'
import { v4 } from 'uuid'
import { ProjError } from '../plugins/error'
import { StripUtil } from '../plugins/strip'
import { SYNC_TO_AUDIO } from '../plugins/config'
import { roundToFrame } from '../plugins/utils/roundToFrame'
import * as T from 'three'

export const useStore = defineStore('project', {
  state: () => ({
    // project及asset，strip
    project: <Project>new Project({
      version: _VERSION_,
      name: 'untitled',
      width: 1920,
      height: 1080,
      fps: 60,
      duration: 10,
      assets: [],
      strips: []
    }),

    selectedAsset: <Asset | null>null,
    selectedStrip: <Strip | null>null,

    // 播放控制参数
    isPlay: <boolean>false,
    start: <number>0,
    currentTime: <number>0,
    offset: <number>0,
    scale: <number>10,
    minScale: <number>1,
    maxScale: <number>1000,
    showLength: <number>0,

    // 渲染相关参数
    scene: <T.Scene>new T.Scene()
  }),
  getters: {
    showStrips(): Strip[] {
      return this.project.strips.filter(s => {
        return s.start + s.length > this.start && s.start < this.start + this.showLength
      })
    },
    rawScene(): T.Scene {
      return toRaw(this.scene)
    }
  },
  actions: {
    // Asset 的三大函数
    changeSelectedAsset(asset: Asset) {
      this.selectedAsset = asset
    },
    deleteSelectedAsset() {
      const i = this.project.assets.findIndex(item => item.id == this.selectedAsset?.id)
      this.project.assets.splice(i, 1)
      this.selectedAsset = null
    },
    addAsset(file: File) {
      if (VideoAsset.isSupportType(file.type)) {
        // 获取asset的path
        const src = window.URL.createObjectURL(file)
        // 形参（id: string, name: string, path: string）
        const asset = new VideoAsset(v4(), file.name, src)
        this.project.assets.push(asset)
      } else if (AudioAsset.isSupportType(file.type)) {
        const src = window.URL.createObjectURL(file)
        const asset = new AudioAsset(v4(), file.name, src)
        this.project.assets.push(asset)
      } else if (ImageAsset.isSupportType(file.type)) {
        const src = window.URL.createObjectURL(file)
        const asset = new ImageAsset(v4(), file.name, src)
        this.project.assets.push(asset)
      } else {
        throw new ProjError('Unsupported file type' + file.type)
      }
    },

    // 更新strip(对实现播放功能至关重要)
    updateStrip(delta: number = 0) {
      this.project.strips.forEach((s: Strip) => {
        s.update(this.currentTime, delta, this.isPlay, SYNC_TO_AUDIO, this.project.fps)
      })
    },

    // 更新timeline长度
    updateShowLength(el: HTMLElement | null) {
      if (el) {
        const rect = el.getBoundingClientRect()
        const length = rect.width / this.scale
        this.showLength = length
      }
    },

    // 改变currentTime，同时调用updateStrip
    changeCurrentTime(time: number) {
      this.currentTime = time
      this.updateStrip()
    },

    upScale(el: HTMLElement | null) {
      if (this.scale * 2 < this.maxScale) {
        this.updateShowLength(el)
        const leftLength = this.currentTime - this.start
        const rate = leftLength / this.showLength
        this.scale *= 2
        this.updateShowLength(el)
        this.start = this.currentTime - rate * this.showLength
      }
    },
    downScale(el: HTMLElement | null) {
      if (this.scale * 0.5 < this.minScale) {
        this.scale = this.minScale
      } else {
        this.updateShowLength(el)
        const leftLength = this.currentTime - this.start
        const rate = leftLength / this.showLength
        this.scale *= 0.5
        this.updateShowLength(el)
        this.start = this.currentTime - rate * this.showLength
      }
    },

    getValid(self: Strip) {
      for (let j = 0; j < this.project.strips.length; j++) {
        const t = this.project.strips[j]
        if (self == t) continue
        const ts = t.start
        const te = t.length + ts
        if (self.end > ts + 0.001 && self.start + 0.001 < te && self.layer == t.layer) {
          return false
        }
      }
      return true
    },
    addStrip(strip: Strip) {
      for (let i = 0; i < 4; i++) {
        strip.layer = i
        if (this.getValid(strip)) break
      }
      this.project.strips.push(strip)
      console.log(this.project.strips)
      if (StripUtil.isThreeJsStrip(strip)) {
        this.scene?.add(strip.obj)
      }
      this.changeDuration()
      // console.log(this.scene)
    },
    addTextStrip() {
      const newStrip = new TextStrip({
        id: v4(),
        start: this.currentTime,
        length: 5,
        layer: 0,
        text: 'New Text',
        fontSize: 14,
        fontFamily: 'serif',
        color: 'white',
        position: { x: 0, y: 0, z: 0 },
        type: 'Text',
        shadowColor: '',
        shadowBlur: 0,
        outlineColor: '',
        outlineSize: 0
      })
      newStrip.start = this.currentTime
      newStrip.length = 5
      newStrip.position.set(500, 500, -10)
      this.addStrip(newStrip)
    },
    addVideoStrip() {
      const newStrip = new VideoStrip({
        start: this.currentTime,
        length: 5,
        layer: 0,
        position: { x: 0, y: 0, z: 0 },
        percent: 100,
        src: '',
        id: '',
        type: 'Video',
        assetId: '',
        videoOffset: 0
      })
      this.addStrip(newStrip)
    },
    addImageStrip() {
      const newStrip = new ImageStrip({
        start: this.currentTime,
        length: 5,
        layer: 0,
        position: { x: 200, y: 200, z: 0 },
        percent: 100,
        src: '',
        id: '',
        type: 'Image',
        assetId: ''
      })
      this.addStrip(newStrip)
    },
    addAudioStrip() {
      const newStrip = new AudioStrip({
        id: '',
        start: 0,
        length: 5,
        layer: 0,
        type: 'Audio'
      })
      this.addStrip(newStrip)
    },
    split() {
      if (!this.selectedStrip) throw new ProjError('Split operation target strip is not found.')
      const target = this.selectedStrip
      const i = this.project.strips.findIndex(s => s == target)
      if (i == -1) throw new ProjError('Split operation target strip is not found.')
      if (target instanceof VideoStrip) {
        const newStrip = new VideoStrip(
          {
            start: this.currentTime,
            length: target.end - this.currentTime,
            layer: 0,
            position: target.position,
            src: '',
            id: '',
            type: 'Video',
            assetId: target.videoAsset?.id || '',
            videoOffset: this.currentTime - target.start + target.videoOffset
          },
          target.videoAsset
        )
        const length = this.currentTime - target.start
        this.changeLength(target, length)
        this.addStrip(newStrip)
      } else {
        throw new ProjError(`Split operations are not supported in ${target.type}.`)
      }
    },

    changeLength(target: Strip, v: number) {
      target.length = v
      const valid = this.getValid(target)
      if (!valid) {
        this.project.strips.forEach(s => {
          if (s == target) return
          if (target.layer == s.layer) {
            const center = s.start + s.length / 2
            if (v > center && v < s.start + s.length) {
              v = roundToFrame(s.start + s.length, this.project.fps)
              target.length = v
            } else if (target.start < center && target.start + target.length > s.start) {
              v = roundToFrame(s.start - target.start, this.project.fps)
              target.length = v
            }
          }
        })
      }
    },
    changeStart(n: number, target: Strip) {
      target.start = n
      const valid = this.getValid(target)
      // if在strip重合时执行
      if (!valid) {
        console.log('注意哦')
        this.project.strips.forEach(s => {
          if (s == target) return
          if (target.layer == s.layer) {
            const center = s.start
            if (n > center && n < s.start + s.length) {
              n = roundToFrame(s.start + s.length, this.project.fps)
              target.start = n
            } else if (n < center && n + target.length > s.start) {
              n = roundToFrame(s.start - target.length, this.project.fps)
              target.start = n
            }
          }
        })
      }
    },

    deleteStrip() {
      if (this.selectedStrip) {
        const i = this.project.strips.findIndex(s => s == this.selectedStrip)
        if (i != -1) {
          const strip = this.project.strips[i]
          if (StripUtil.isThreeJsStrip(strip)) {
            strip.obj.removeFromParent()
          }
          this.project.strips.splice(i, 1)
          this.selectedStrip = null
        }
        this.changeDuration()
      }
    },
    // 参数strip来自getter的showStrip，又来自project.strips，其一直保持着响应式的属性（proxy代理）
    // 将proxy响应式对象strip赋值给selectedStrip对象，其也获得响应式proxy属性，且二者同源，即同步，可以理解为二者为同一对象
    // 对其中任一目标修改（如修改strip），会同步影响另一个clone体(selectedStrip)
    changeSelectedStrip(strip: Strip) {
      this.selectedStrip = strip
      // console.log(this.selectedStrip)
      // this.selectedStrip.length = 6
      // console.log(strip)
      // console.log(this.project.strips)
      // strip.length = 5
      // console.log(this.selectedStrip)
      // console.log(this.project.strips)
    },
    isSelectedStrip(strip: Strip) {
      return this.selectedStrip?.id === strip.id
    },
    changeDuration() {
      let duration = 0
      for (let i = 0; i < this.project.strips.length; i++) {
        const s = this.project.strips[i]
        if (duration < s.start + s.length) {
          duration = s.start + s.length
        }
      }
      this.project.duration = duration
    }
  }
})
