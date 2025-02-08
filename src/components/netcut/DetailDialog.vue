<script lang="ts" setup>
import type { Data } from '@/types/netcut'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps<{
  modelValue: boolean
  data: Data
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 优化正则表达式匹配
const patterns = {
  // 手机号：1开头的11位数字
  phone: /(?<![0-9])1[3-9]\d{9}(?![0-9])/g,
  
  // 邮箱：完整的邮箱格式，避免部分匹配
  email: /(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
  
  // URL：支持多种格式的网址，但排除邮箱
  url: /(?:(?:https?:\/\/)?(?!.*@)(?:[\w-]+\.)+[a-zA-Z]{2,}(?:\/[^\s<>]*)?)/g,
  
  // 密码：至少包含1个数字和1个字母的6-20位字符串，两边必须是空白字符或标点
  password: /(?:^|[\s,.\/?!])((?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,20})(?=[\s,.\/?!]|$)/g
}

// 提取信息
const extractInfo = computed(() => {
  const allMatches = new Set()
  const matches: string[] = []

  // 按顺序匹配所有类型
  Object.entries(patterns).forEach(([type, pattern]) => {
    const found = props.data.description.match(pattern) || []
    found.forEach(item => {
      // 对于密码匹配，需要去除前后的空白字符或标点
      const cleanItem = type === 'password' ? item.trim().replace(/^[\s,.\/?!]+|[\s,.\/?!]+$/g, '') : item
      if (!allMatches.has(cleanItem)) {
        allMatches.add(cleanItem)
        matches.push(cleanItem)
      }
    })
  })

  return matches
})

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('复制成功')
  } catch (err) {
    ElMessage.error('复制失败')
  }
}

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="data.name"
    width="90%"
    :max-width="600"
    class="detail-dialog"
    :close-on-click-modal="true"
    destroy-on-close
    @close="handleClose"
  >
    <div class="detail-content">
      <div class="detail-header">
        <el-tag size="small" effect="plain" class="detail-date">
          {{ data.date }}
        </el-tag>
      </div>
      <div class="detail-body">
        <pre class="detail-description">{{ data.description }}</pre>
      </div>
      <div v-if="extractInfo.length" class="detail-info">
        <div class="info-tags">
          <el-tag
            v-for="item in extractInfo"
            :key="item"
            class="info-tag"
            @click="copyToClipboard(item)"
            effect="light"
          >
            {{ item }}
          </el-tag>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
/* 详情对话框样式 */
.detail-dialog :deep(.el-dialog__header) {
  margin-right: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.detail-content {
  padding: 4px;
}

.detail-header {
  margin-bottom: 16px;
}

.detail-date {
  font-size: 13px;
}

.detail-body {
  color: var(--el-text-color-regular);
}

.detail-description {
  margin: 0;
  line-height: 1.8;
  white-space: pre-wrap;
  font-size: 15px;
  font-family: var(--el-font-family);
  padding: 16px;
  color: inherit;
  overflow-wrap: break-word;
  tab-size: 4;
  border-radius: 8px;
  background-color: var(--el-fill-color-lighter);
}

/* 添加新样式 */
.detail-info {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.info-tag {
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  padding: 0 12px;
  height: 28px;
  line-height: 26px;
  background-color: var(--el-fill-color-light);
  border-color: var(--el-border-color-light);
  color: var(--el-text-color-regular);
}

.info-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-5);
  color: var(--el-color-primary);
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .detail-description {
    font-size: 15px;
    line-height: 1.7;
    padding: 14px;
    margin: 0;
  }

  .detail-content {
    padding: 16px;
  }

  .detail-info {
    margin-top: 20px;
    padding-top: 16px;
  }

  .info-tag {
    font-size: 12px;
    height: 26px;
    line-height: 24px;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .detail-dialog :deep(.el-dialog__header) {
    border-bottom-color: var(--el-border-color-darker);
  }

  .detail-dialog :deep(.el-dialog) {
    background: var(--el-bg-color-darker);
  }

  .detail-dialog :deep(.el-dialog__title) {
    color: var(--el-text-color-primary);
  }

  .detail-description {
    background-color: var(--el-fill-color-darker);
  }

  .detail-info {
    border-top-color: var(--el-border-color-darker);
  }

  .info-tag:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  }
}
</style> 