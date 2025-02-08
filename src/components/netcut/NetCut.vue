<script lang="ts" setup>
import type {Data} from '@/types/netcut'
import {addData, deleteData, queryAllData, updateData} from "@/api/netcut.ts";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {ResultCode} from "@/types/netcut.ts";
import {ElMessage, ElMessageBox} from 'element-plus';
import {Plus} from '@element-plus/icons-vue';
import EditDialog from './EditDialog.vue';
import DetailDialog from './DetailDialog.vue';
import DataList from './DataList.vue'
import {useRoute, useRouter} from 'vue-router'
import useUserStore from "@/stores/user.ts";
import Logout from "@/components/Logout.vue";

const data = reactive<Data[]>([
  {
    date: '2025-02-06',
    name: '你干嘛哎呦',
    description: '只因你太美',
  }
])

const newData = reactive({
  name: '',
  description: '',
  date: new Date().toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\//g, '-')
});

const editingData = reactive({
  name: '',
  description: '',
  date: '',
});

const loading = ref(false);
const deleting = ref<string | null>(null);
const adding = ref(false);
const editDialogVisible = ref(false);
const detailDialogVisible = ref(false);
const currentDetail = reactive({
  name: '',
  description: '',
  date: ''
});

const route = useRoute()
const router = useRouter()

// 从路由获取初始页码
const currentPage = ref(Number(route.query.page) || 1)

// 监听页码变化，更新路由
watch(currentPage, (newPage) => {
  router.push({
    query: {
      ...route.query,
      page: newPage.toString()
    }
  })
})

// 监听路由变化，更新页码
watch(
    () => route.query.page,
    (newPage) => {
      const page = Number(newPage)
      if (!isNaN(page) && page > 0) {
        currentPage.value = page
      } else if (currentPage.value !== 1) {
        currentPage.value = 1
      }
    }
)

const pageSize = ref(6)
const totalItems = ref(0)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return data.slice(start, end)
})

// pinia仓库
const userStore = useUserStore()

onMounted(async () => {
  loading.value = true;
  try {
    const respond = await queryAllData(userStore.username);
    if (respond.code === ResultCode.SUCCESS) {
      userStore.userData = respond.data;
      data.push(...respond.data)
      totalItems.value = data.length
      // if(!route.query.page) return;
      // 判断当前路径的query.page是否大于数据的总页数，
      let totalPages = respond.data.length % pageSize.value;
      totalPages = totalPages === 0 ? respond.data.length / pageSize.value : Math.floor(totalPages / pageSize.value) + 1;
      if (currentPage.value > totalPages) {
        console.log('胡闹！你根本没这么多页')
        currentPage.value = 1
      }
    }
  } catch (error) {
    ElMessage.error('加载数据失败');
  } finally {
    loading.value = false;
  }
});

const handleAdd = async () => {
  if (adding.value) return;

  // 表单验证
  if (!newData.name || !newData.description || !newData.date) {
    ElMessage.error('请填写完整信息');
    return;
  }

  // 检查是否存在相同名称的记录
  const existingIndex = data.findIndex(item => item.name === newData.name);
  if (existingIndex !== -1) {
    try {
      await ElMessageBox.confirm(
          '已存在相同名称的记录，继续添加将覆盖原有记录，是否继续？',
          '覆盖确认',
          {
            confirmButtonText: '确定覆盖',
            cancelButtonText: '取消',
            type: 'warning',
          }
      );
    } catch (error) {
      return; // 用户取消操作
    }
  }

  adding.value = true;

  try {
    const res = await addData({...newData, username: userStore.username});
    if (res.code === ResultCode.SUCCESS) {
      if (existingIndex !== -1) {
        // 如果是覆盖，则替换原有记录
        Object.assign(data[existingIndex], {...newData});
        ElMessage.success('记录已更新');
      } else {
        // 如果是新增，则添加到列表顶部
        data.unshift({...newData});
        totalItems.value = data.length;
        ElMessage.success("添加成功")
      }

      // 重置表单
      Object.assign(newData, {
        name: '',
        description: '',
        date: new Date().toLocaleString('zh-CN', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).replace(/\//g, '-')
      });
    }
  } catch (error) {
    ElMessage.error('添加失败');
  } finally {
    adding.value = false;
  }
};

const handleDelete = async (name: string) => {
  deleting.value = name;
  try {
    const res = await deleteData({name, username: userStore.username});
    if (res.code === ResultCode.SUCCESS) {
      const index = data.findIndex(item => item.name === name);
      if (index > -1) {
        data.splice(index, 1);
        totalItems.value = data.length;
        if (paginatedData.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
        }
      }
      ElMessage.success('删除成功');
    }
  } catch (error) {
    ElMessage.error('删除失败');
  } finally {
    deleting.value = null;
  }
};

const handleEdit = (item: Data) => {
  editingData.name = item.name;
  editingData.description = item.description;
  editingData.date = new Date().toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(/\//g, '-');
  editDialogVisible.value = true;
};

const handleEditSubmit = async (updatedData: Data) => {
  try {
    console.log(updatedData)
    const res = await updateData({...updatedData, username: userStore.username});
    if (res.code === ResultCode.SUCCESS) {
      const index = data.findIndex(item => item.name === updatedData.name);
      if (index > -1) {
        Object.assign(data[index], updatedData);
      }
      editDialogVisible.value = false;
      ElMessage.success('更新成功');
    }
  } catch (error) {
    ElMessage.error('更新失败');
  }
};

const handleViewDetail = (item: Data) => {
  currentDetail.name = item.name;
  currentDetail.description = item.description;
  currentDetail.date = item.date;
  detailDialogVisible.value = true;
};


</script>

<template>
  <div class="show-netcut">
    <Logout/>
    <el-form :inline="true" class="data-form">
      <el-form-item label="名称">
        <el-input
            v-model="newData.name"
            placeholder="请输入名称"
            clearable
        />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
            v-model="newData.description"
            placeholder="请输入描述"
            clearable
        />
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
            v-model="newData.date"
            type="datetime"
            placeholder="选择日期时间"
            format="MM-DD HH:mm"
            value-format="MM-DD HH:mm"
            :teleported="false"
        />
      </el-form-item>
      <el-form-item class="add-button-item">
        <el-button
            type="primary"
            class="add-button"
            @click="handleAdd"
            :icon="Plus"
            :loading="adding"
        >
          {{ adding ? '添加中...' : '添加记录' }}
        </el-button>
      </el-form-item>
    </el-form>

    <DataList
        :data="paginatedData"
        :loading="loading"
        :page-size="pageSize"
        :total-items="totalItems"
        :deleting="deleting"
        v-model:current-page="currentPage"
        @delete="handleDelete"
        @edit="handleEdit"
        @view="handleViewDetail"
    />

    <!-- 添加编辑对话框 -->
    <EditDialog
        v-model="editDialogVisible"
        :data="editingData"
        @submit="handleEditSubmit"
    />

    <!-- 添加详情对话框 -->
    <DetailDialog
        v-model="detailDialogVisible"
        :data="currentDetail"
    />
  </div>

</template>

<style scoped>
.show-netcut {
  margin: 0 auto;
  padding: 20px;
  max-width: 1200px;
  width: 100%;
  min-height: 60vh;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.data-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .show-netcut {
    padding: 12px;
  }

  .data-form {
    padding: 16px;
    margin-bottom: 16px;
  }

  /* 改进表单在移动端的布局 */
  :deep(.el-form--inline) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  :deep(.el-form--inline .el-form-item) {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }

  :deep(.el-form-item__label) {
    padding-bottom: 8px;
  }

  .add-button {
    width: 100%;
    height: 40px;
    font-size: 15px;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .show-netcut {
    background: #1a1a1a;
  }

  .data-form {
    background: #2a2a2a;
  }
}
</style>

