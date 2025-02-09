<script setup lang="ts">
import {ElMessage, ElMessageBox} from 'element-plus'
import useUserStore from "@/stores/user.ts";

const userStore = useUserStore();

const goBack = () => {
  ElMessageBox.confirm(
    `陛下要起驾回宫了？还有奏折未批阅呢！`,
    '且慢！📜',
    {
      confirmButtonText: '起驾回宫 🚪',
      cancelButtonText: '再批奏折 📝',
      type: 'warning',
      customClass: 'imperial-dialog'
    }
  )
      .then(async () => {
        await userStore.logout()
        ElMessage({
          type: 'success',
          message: '恭送陛下！期待您的下次翻牌~❤️',
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '陛下英明！臣就知道您舍不得这大好江山～😘',
        })
      })
}
</script>

<template>
  <div class="logout imperial-logout">
    <el-page-header @back="goBack" class="imperial-header" title="回宫">
      <template #content>
        <span class="text-large font-600 mr-3 title imperial-title"> 
          御书房 📚

        </span>
      </template>
    </el-page-header>
  </div>
</template>

<style scoped>
.imperial-logout {
  /* background: rgba(252, 246, 229, 0.9); */
  /* border: 1px solid #d4af37; */
  /* border-radius: 8px; */
  padding: 8px 16px;
  /* box-shadow: 0 2px 8px rgba(152, 109, 42, 0.1); */
  margin: 10px;
}

.imperial-title {
  font-family: '华文行楷', cursive;
  background: linear-gradient(45deg, #d4af37, #cdaa7d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
  font-size: 24px !important;
}

:deep(.imperial-header .el-page-header__content) {
  font-family: '楷体';
  color: #8b4513;
}

:deep(.el-page-header__left) {
  padding: 4px;
  transition: all 0.3s ease;
}

:deep(.el-page-header__left:hover) {
  /*background: rgba(212, 175, 55, 0.1);*/
  transform: scale(1.1);
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .imperial-logout {
    background: rgba(42, 33, 25, 0.9);
    border-color: #cdaa7d;
  }
  
  .imperial-title {
    background: linear-gradient(45deg, #cdaa7d, #8b4513);
  }
  
  :deep(.imperial-header .el-page-header__content) {
    color: #d4af37;
  }
  
  :deep(.el-page-header__left) {
    border-color: #cdaa7d;
  }
}
</style>