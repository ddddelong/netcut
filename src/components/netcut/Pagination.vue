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
  <div class="pagination-wrapper">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      :pager-count="5"
      layout="prev, pager, next"
      @update:current-page="handlePageChange"
      background
      hide-on-single-page
    />
  </div>
</template>

<style scoped>
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .pagination-wrapper {
    margin-top: 16px;
  }
  
  :deep(.el-pagination) {
    --el-pagination-button-width: 32px;
    --el-pagination-button-height: 32px;
    font-size: 14px;
  }
}
</style> 