<script setup lang="ts">
import {ElMessage, ElMessageBox} from 'element-plus'
import useUserStore from "@/stores/user.ts";

const userStore = useUserStore();

const goBack = () => {
  ElMessageBox.confirm(
      `这就起驾回宫了？爱妃还在后宫等您呢！`,
      '陛下三思啊！🫣',
      {
        confirmButtonText: '狠心离去💔',
        cancelButtonText: '再陪朕一会🥺',
        type: 'error',
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
  <div class="logout">
    <el-page-header @back="goBack" title="放我出去">
      <template #content>
        <span class="text-large font-600 mr-3 title"> NetCut </span>
      </template>
    </el-page-header>
  </div>
</template>

<style scoped>
.logout {
  margin: 10px;
}

.title {
  font-size: 26px;
  font-weight: 700;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
}
</style>