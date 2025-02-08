<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  total: number
  currentPage: number
  pageSize: number
}>()

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

const handlePageChange = (page: number) => {
  emit('update:currentPage', page)
}
</script>

<template>
  <div class="pagination-wrapper imperial-pagination">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :pager-count="5"
      layout="prev, pager, next"
      @update:current-page="handlePageChange"
      class="imperial-pager"
      background
      hide-on-single-page
    />
  </div>
</template>

<style scoped>
.imperial-pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding: 16px 0;
  /* background: rgba(252, 246, 229, 0.9); */
  /* border: 1px solid #d4af37; */
  border-radius: 12px;
  margin-top: 20px;
}

:deep(.imperial-pager .btn-prev),
:deep(.imperial-pager .btn-next) {
  border: 1px solid #d4af37 !important;
  border-radius: 50%;
  color: #8b4513 !important;
  font-family: '楷体';
}

:deep(.imperial-pager .number) {
  font-family: '楷体';
  color: #8b4513 !important;
  border: 1px solid #d4af37;
  border-radius: 8px;
  margin: 0 4px;
}

:deep(.imperial-pager .number:hover) {
  color: #d4af37 !important;
  transform: scale(1.1);
}

:deep(.imperial-pager .is-active) {
  background: #d4af37 !important;
  color: #fff !important;
  box-shadow: 0 2px 6px rgba(152, 109, 42, 0.2);
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .imperial-pagination {
    background: rgba(42, 33, 25, 0.9);
    border-color: #cdaa7d;
  }

  :deep(.imperial-pager .btn-prev),
  :deep(.imperial-pager .btn-next),
  :deep(.imperial-pager .number) {
    border-color: #cdaa7d !important;
    color: #d4af37 !important;
  }

  :deep(.imperial-pager .is-active) {
    background: #cdaa7d !important;
    color: #2a2119 !important;
  }
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .imperial-pagination {
    margin-top: 16px;
  }
  
  :deep(.imperial-pager) {
    --el-pagination-button-width: 32px;
    --el-pagination-button-height: 32px;
    font-size: 14px;
  }
}
</style> 