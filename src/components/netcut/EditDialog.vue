<script lang="ts" setup>
import type { Data } from '@/types/netcut'
import { ref, computed } from 'vue'

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
    title="编辑记录"
    width="95%"
    :max-width="800"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="edit-dialog"
    @close="handleClose"
  >
    <el-form :model="data" label-width="50px" class="edit-form">
      <el-form-item label="名称" class="edit-form-item">
        <el-input 
          v-model="data.name" 
          placeholder="请输入名称"
          disabled
          class="edit-input"
        />
      </el-form-item>
      <el-form-item label="描述" class="edit-form-item">
        <el-input
          v-model="data.description"
          type="textarea"
          :rows="12"
          :autosize="{ minRows: 8, maxRows: 20 }"
          placeholder="请输入描述"
          class="edit-textarea"
        />
      </el-form-item>
      <el-form-item label="日期" class="edit-form-item">
        <el-date-picker
          v-model="data.date"
          type="datetime"
          placeholder="选择日期时间"
          format="MM-DD HH:mm"
          value-format="MM-DD HH:mm"
          class="edit-date-picker"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" class="cancel-button">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="editing"
          class="submit-button"
        >
          {{ editing ? '保存中...' : '保存' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.edit-dialog :deep(.el-dialog) {
  --el-dialog-padding-primary: 24px;
  border-radius: 12px;
}

.edit-dialog :deep(.el-dialog__header) {
  margin-right: 0;
  padding: var(--el-dialog-padding-primary);
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-bottom: 0;
}

.edit-dialog :deep(.el-dialog__body) {
  padding: var(--el-dialog-padding-primary);
}

.edit-dialog :deep(.el-dialog__footer) {
  padding: var(--el-dialog-padding-primary);
  border-top: 1px solid var(--el-border-color-lighter);
  margin-top: 0;
}

.edit-form {
  --form-gap: 20px;
  display: flex;
  flex-direction: column;
  gap: var(--form-gap);
}

.edit-form-item {
  margin-bottom: 0;
}

.edit-form-item :deep(.el-form-item__label) {
  font-weight: 500;
  padding-bottom: 8px;
  color: var(--el-text-color-regular);
}

.edit-textarea :deep(.el-textarea__inner) {
  font-family: var(--el-font-family);
  padding: 12px;
  line-height: 1.6;
  font-size: 14px;
  border-radius: 8px;
  resize: vertical;
}

.edit-input :deep(.el-input__inner),
.edit-date-picker :deep(.el-input__inner) {
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.submit-button,
.cancel-button {
  min-width: 100px;
  padding: 10px 20px;
  font-size: 14px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .edit-dialog :deep(.el-dialog) {
    --el-dialog-padding-primary: 16px;
    width: 92% !important;
    max-width: none !important;
  }

  .edit-form {
    --form-gap: 16px;
  }

  .edit-textarea :deep(.el-textarea__inner) {
    font-size: 15px;
  }

  .submit-button,
  .cancel-button {
    flex: 1;
    min-width: 0;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .edit-dialog :deep(.el-dialog) {
    background: var(--el-bg-color-darker);
  }

  .edit-dialog :deep(.el-dialog__title) {
    color: var(--el-text-color-primary);
  }

  .edit-textarea :deep(.el-textarea__inner) {
    background-color: var(--el-bg-color);
  }

  .edit-form-item :deep(.el-form-item__label) {
    color: var(--el-text-color-primary);
  }
}
</style> 