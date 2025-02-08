<script lang="ts" setup>
import type { Data } from '@/types/netcut';
import { Close, Select } from '@element-plus/icons-vue';
import { computed, ref } from 'vue';

const props = defineProps<{
  modelValue: boolean
  data: Data
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: Data]
}>()

const editing = ref(false)
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleSubmit = async () => {
  if (editing.value) return
  editing.value = true
  try {
    emit('submit', props.data)
  } finally {
    editing.value = false
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="御批奏折 ✍️"
    width="95%"
    :max-width="800"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="edit-dialog imperial-editor"
    @close="handleClose"
  >
    <div class="imperial-scroll">
      <el-form :model="data" label-width="100px" class="edit-form">
        <el-form-item label="📜 奏本名" class="edit-form-item">
          <el-input 
            v-model="data.name" 
            placeholder="恭请陛下赐名"
            disabled
            class="edit-input imperial-input"
          />
        </el-form-item>
        <el-form-item label="📖 奏本内容" class="edit-form-item">
          <el-input
            v-model="data.description"
            type="textarea"
            :rows="12"
            :autosize="{ minRows: 8, maxRows: 20 }"
            placeholder="请陛下朱批御览"
            class="edit-textarea imperial-scroll"
          />
        </el-form-item>
        <el-form-item label="📅 黄道吉日" class="edit-form-item">
          <el-date-picker
            v-model="data.date"
            type="datetime"
            placeholder="择良辰吉时"
            format="MM-DD HH:mm"
            value-format="MM-DD HH:mm"
            class="edit-date-picker imperial-date"
          />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" class="cancel-button imperial-btn">
          <el-icon><Close /></el-icon>
          <span>朕不批了</span>
        </el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="editing"
          class="submit-button imperial-btn"
        >
          <el-icon v-if="!editing"><Select /></el-icon>
          {{ editing ? '御笔亲批中...🖋️' : '钦此' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
/* 新增皇家样式 */
.imperial-editor :deep(.el-dialog__title) {
  font-family: '华文行楷', cursive;
  background: linear-gradient(45deg, #d4af37, #cdaa7d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
}

.imperial-editor :deep(.el-dialog) {
  background: #fcf6e5;
  border: 2px solid #d4af37;
  border-radius: 12px;
}

.imperial-scroll {
  /* background: url('~@/assets/paper-texture.jpg');
  padding: 20px;
  border-radius: 8px; */
  /* border: 1px solid #d4af37; */
}

.imperial-input :deep(.el-input__inner) {
  background: rgba(255, 255, 255, 0.8);
  border-color: #d4af37;
  font-family: '楷体',serif;
  color: #8b4513;
}

.imperial-date :deep(.el-input__inner) {
  font-family: '楷体',serif;
  color: #8b4513;
}

.imperial-btn {
  font-family: '楷体',serif;
  border-radius: 20px;
  padding: 12px 24px;
  border: 1px solid #d4af37;
  background: linear-gradient(145deg, #fff3e0, #ffe0b2);
  color: #8b4513 !important;
}

.imperial-btn:hover {
  background: linear-gradient(145deg, #ffe0b2, #fff3e0);
  transform: translateY(-1px);
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .imperial-editor :deep(.el-dialog) {
    background: #2a2119;
    border-color: #cdaa7d;
  }
  
  .imperial-scroll {
    background: #2a2119;
    border-color: #cdaa7d;
  }
  
  .imperial-input :deep(.el-input__inner) {
    background: rgba(42, 33, 25, 0.8);
    border-color: #cdaa7d;
    color: #d4af37;
  }
  
  .imperial-btn {
    background: linear-gradient(145deg, #3a2f28, #4a3f38);
    border-color: #cdaa7d;
    color: #d4af37 !important;
  }
}
</style> 