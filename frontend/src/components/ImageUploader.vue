<template>
  <div>
    <div class="flex items-center gap-2 mb-2">
      <label class="terminal-btn-secondary text-sm cursor-pointer">
        <input type="file" accept="image/*" multiple @change="onFileChange" class="hidden" />
        上传图片
      </label>
      <span class="text-terminal-muted text-xs">支持 JPEG/PNG/GIF/WebP，最大 5MB</span>
    </div>

    <div v-if="previewImages.length > 0" class="flex flex-wrap gap-2 mt-2">
      <div v-for="(img, index) in previewImages" :key="index"
        class="relative w-20 h-20 rounded overflow-hidden border border-terminal-border">
        <img :src="img.url" class="w-full h-full object-cover" />
        <button @click="removeImage(index)"
          class="absolute top-0 right-0 bg-terminal-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-bl">
          x
        </button>
        <div v-if="img.uploading" class="absolute inset-0 bg-[#3d3528]/50 flex items-center justify-center">
          <span class="text-terminal-green text-xs">上传中...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { uploadImage } from '../api/upload.js'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue'])
const previewImages = ref([...props.modelValue])

watch(() => props.modelValue, (val) => { previewImages.value = [...val] })

async function onFileChange(e) {
  const files = Array.from(e.target.files)
  for (const file of files) {
    if (file.size > 5 * 1024 * 1024) {
      alert(`图片 ${file.name} 超过 5MB 限制`)
      continue
    }
    const previewUrl = URL.createObjectURL(file)
    const imgObj = { url: previewUrl, uploading: true, path: null }
    previewImages.value.push(imgObj)

    try {
      const res = await uploadImage(file)
      imgObj.url = res.data.url
      imgObj.path = res.data.path
      imgObj.uploading = false
      emitUpdate()
    } catch (err) {
      alert('图片上传失败: ' + (err.message || '未知错误'))
      const idx = previewImages.value.indexOf(imgObj)
      if (idx > -1) previewImages.value.splice(idx, 1)
    }
  }
  e.target.value = ''
}

function removeImage(index) {
  previewImages.value.splice(index, 1)
  emitUpdate()
}

function emitUpdate() {
  const uploaded = previewImages.value
    .filter(img => !img.uploading && img.path)
    .map(img => ({ url: img.url, path: img.path }))
  emit('update:modelValue', uploaded)
}
</script>
