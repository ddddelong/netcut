<script setup lang="ts">
import useUserStore from '@/stores/user.ts';
import type { RegisterForm } from '@/types/login.ts';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {AxiosError} from "axios";

const router = useRouter();
const userStore = useUserStore();

const registerForm = reactive<RegisterForm>({
  username: '',
  password: '',
  confirmPassword: '',
});

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 12, message: '长度在 4 到 12 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: (rule: any, value: string, callback: Function) => {
      if (value !== registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }, trigger: 'blur' }
  ]
});

const isLoading = ref(false);
const formRef = ref();

const handleRegister = async () => {
  try {
    await formRef.value.validate();
    
    if (isLoading.value) return;
    
    isLoading.value = true;
    await userStore.register(registerForm);
    isLoading.value = false;
    ElMessage.success('注册成功，正在跳转...');
    setTimeout(() => router.push('/login'), 1500);
  } catch (error) {
    if (error) {
      // 断言error为AxiosError.response.data
      const errorData = error as AxiosError<{ message: string }>;
      ElMessage.error(errorData.message || '注册失败');
    } else {
      ElMessage.warning('请正确填写表单');
    }
    isLoading.value = false;
  } finally {
    isLoading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h2>创建新账号</h2>
        <p class="subtitle">哈哈哈哈哈</p>
      </div>

      <el-form 
        ref="formRef"
        :model="registerForm" 
        :rules="rules" 
        label-position="top"
        class="register-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>

        <el-button
          type="primary"
          class="register-button"
          :loading="isLoading"
          @click="handleRegister"
        >
          立即注册
        </el-button>
      </el-form>

      <div class="login-link">
        已有账号？
        <el-link type="primary" @click="goToLogin">立即登录</el-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  .register-box {
    width: 450px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    .register-header {
      text-align: center;
      margin-bottom: 40px;

      h2 {
        font-size: 24px;
        color: #2c3e50;
        margin-bottom: 8px;
        font-weight: 600;
      }

      .subtitle {
        color: #7f8c8d;
        font-size: 14px;
      }
    }

    .register-form {
      :deep(.el-form-item__label) {
        font-weight: 500;
        color: #2c3e50;
      }

      .el-input {
        border-radius: 8px;
      }

      :deep(.el-form-item__error) {
        color: #ff6b6b;
        font-size: 12px;
        margin-top: 4px;
      }

      :deep(.el-input.is-error) {
        --el-input-border-color: #ff6b6b;
        
        input {
          box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
        }
      }
    }

    .register-button {
      width: 100%;
      height: 40px;
      margin-top: 20px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      border: none;
      font-size: 16px;
      font-weight: 600;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1),
                   0 3px 6px rgba(0, 0, 0, 0.08);
      }
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
      color: #7f8c8d;
      font-size: 14px;

      .el-link {
        vertical-align: baseline;
      }
    }
  }
}

// 响应式设计
@media (max-width: 480px) {
  .register-container {
    padding: 16px;

    .register-box {
      width: 100%;
      padding: 24px 20px;

      .register-header h2 {
        font-size: 20px;
      }

      .register-button {
        font-size: 15px;
      }

      .register-form {
        :deep(.el-form-item__error) {
          font-size: 11px;
        }
      }
    }
  }
}
</style>
