<script setup lang="ts">
import type { Data } from '@/types/netcut'
import { copyToClipboard } from "@/utils/copy.ts"
import { render } from '@/utils/markdown-it'
import { Delete, DocumentCopy, Edit, View } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Pagination from './Pagination.vue'

defineProps<{
  data: Data[]
  loading: boolean
  currentPage: number
  pageSize: number
  totalItems: number
  deleting: string | null
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'delete': [name: string]
  'edit': [item: Data]
  'view': [item: Data]
}>()

// Add handler for page change
const handlePageChange = (page: number) => {
  emit('update:currentPage', page)
}

// 修改 formatDescription 函数
const formatDescription = (text: string) => {
  return text
    .replace(/\t/g, '    ') // 将制表符转换为4个空格
    .replace(/\n{3,}/g, '\n\n') // 将3个及以上连续换行符替换为2个
    .split('\n')
    .slice(0, 4) // 在卡片预览中最多显示4行
    .join('\n')
}

const handleDelete = async (name: string) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条记录吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    emit('delete', name)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除操作取消')
    }
  }
}

</script>

<template>
  <div class="data-list" v-loading="loading">
    <el-empty v-if="data.length === 0" description="暂无数据" />
    <template v-else>
      <div class="cards-container">
        <el-card v-for="item in data" :key="item.name" class="data-card">
          <div class="card-header">
            <div class="card-title">
              <h3 class="card-name">{{ item.name }}</h3>
              <el-tooltip 
                content="来人，拿下！" 
                placement="top"
                :show-after="300"
              >
                <el-icon
                  class="copy-icon"
                  @click.stop="copyToClipboard(item.description)"
                >
                  <DocumentCopy />
                </el-icon>
              </el-tooltip>
              <el-tag size="small" effect="plain" class="date-tag">
                {{ item.date }}
              </el-tag>
            </div>
            <div class="card-actions">
              <el-button
                type="primary"
                size="small"
                @click="emit('edit', item)"
                class="edit-button"
              >
                <el-icon><Edit /></el-icon>
                <span>编辑</span>
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(item.name)"
                :loading="deleting === item.name"
                :disabled="deleting !== null"
                class="delete-button"
              >
                <el-icon><Delete /></el-icon>
                <span v-if="deleting !== item.name">删除</span>
                <template #loading>
                  <span class="loading-text">删除中</span>
                </template>
              </el-button>
            </div>
          </div>
          <div class="card-content" @click="emit('view', item)">
            <p class="description" :title="item.description">
              <span v-html="render(formatDescription(item.description))"></span>
<!--              {{ formatDescription(item.description) }}-->
            </p>
            <div class="view-more">
              <el-icon><View /></el-icon>
              <span>点击查看详情</span>
            </div>
          </div>
        </el-card>
      </div>


      <div class="pagination-container">
        <Pagination
          :current-page="currentPage"
          :total="totalItems"
          :page-size="pageSize"
          @update:current-page="handlePageChange"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.data-list {
  display: flex;
  flex-direction: column;
  min-height: 400px;
  position: relative;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 1px;
  flex: 1;
}

.pagination-container {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.data-card {
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.data-card :deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.card-title {
  flex: 1;
  min-width: 0;
  position: relative;
}

.card-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.date-tag {
  font-size: 12px;
  font-weight: normal;
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  padding: 8px;
  margin: -8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.card-content:hover {
  background-color: var(--el-fill-color-light);
}

.description {
  margin: 0;
  line-height: 1.6;
  word-break: break-word;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  color: var(--el-text-color-regular);
  /*white-space: pre-line;*/
  font-family: var(--el-font-family);
  tab-size: 4;
  padding: 0;
  font-size: 14px;
  position: relative;
}

.description::after {
  content: "...";
  position: absolute;
  bottom: 0;
  right: 0;
  padding-left: 40px;
  background: linear-gradient(to right, transparent, var(--el-bg-color) 50%);
  display: none;
}

.description.-truncated::after {
  display: block;
}

.view-more {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  color: var(--el-color-primary);
  font-size: 13px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.view-more .el-icon {
  font-size: 14px;
}

.card-content:hover .view-more {
  opacity: 1;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.edit-button,
.delete-button {
  padding: 6px 12px;
}

.edit-button .el-icon,
.delete-button .el-icon {
  margin-right: 4px;
}

.loading-text {
  font-size: 12px;
}

.copy-icon {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: opacity 0.2s;
  z-index: 1;
}
/* 移动端适配 */
@media screen and (max-width: 768px) {
  .data-list {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0;
    min-height: 300px;
  }

  .data-card {
    margin: 0;
    border-radius: 12px;
  }

  .data-card :deep(.el-card__body) {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 16px;
  }

  .card-title {
    width: 100%;
  }

  .card-name {
    font-size: 18px;
    margin-bottom: 8px;
  }

  .date-tag {
    font-size: 13px;
  }

  .card-actions {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .edit-button,
  .delete-button {
    width: 100%;
    height: 36px;
    font-size: 14px;
  }

  .description {
    font-size: 14px;
    line-height: 1.6;
    padding: 0;
    margin: 8px 0;
  }

  .description::after {
    padding-left: 30px;
  }

  .card-content {
    padding: 12px;
    margin: -12px;
  }

  .view-more {
    opacity: 1;
    margin-top: 12px;
    font-size: 14px;
  }

  .cards-container {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0;
  }

  .pagination-container {
    margin-top: 20px;
    padding-top: 20px;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .data-card {
    background: #2a2a2a;
    border: 1px solid #333;
  }

  .card-name {
    color: #e5e5e5;
  }

  .description {
    color: var(--el-text-color-regular);
  }

  .description::after {
    background: linear-gradient(to right, transparent, var(--el-bg-color-darker) 50%);
  }

  :deep(.el-card) {
    --el-card-bg-color: #2a2a2a;
    border-color: #333;
  }

  :deep(.el-button--primary) {
    --el-button-hover-bg-color: var(--el-color-primary-light-3);
  }

  :deep(.el-button--danger) {
    --el-button-hover-bg-color: var(--el-color-danger-light-3);
  }

  .card-content:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }
}
</style> 