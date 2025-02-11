<script setup lang="ts">
import useUserStore from "@/stores/user.ts";
import type { LoginForm } from "@/types/login.ts";
import { copyToClipboard } from "@/utils/copy.ts";
import { Lock, UserFilled } from '@element-plus/icons-vue';
import { ElMessage } from "element-plus";
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const loginForm = reactive<LoginForm>({
  username: 'admin',
  password: '',
})
const isLoading = ref(false);

const userStore = useUserStore()
const router = useRouter();

// 在现有代码基础上增加验证规则
const formRef = ref();
const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 12, message: '长度在 4 到 12 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
  ]
});

const handleLogin = async () => {
  try {
    // 更严格的验证检查
    const valid = await formRef.value.validate();
    console.log(valid);
    if (!valid) return;

    // 防重复提交检查
    if (isLoading.value) return;
    
    isLoading.value = true;
    await userStore.login(loginForm);
  } catch (error) {
    // 细化错误处理
    if (error instanceof Error) {
      console.error('登录失败:', error);
      ElMessage.error(`登录失败: ${error.message}`);
    }
  } finally {
    isLoading.value = false;
  }
};

// 处理注册
function handleSignIn(): void {
  router.push('/register');
}

// 处理忘记密码
function handleForget(): void {
  ElMessage.warning('玉玺遗失，请重铸玉玺（注册个新号吧）')
}

</script>

<template>
  <div class="login-container">
    <el-form 
      ref="formRef"
      :model="loginForm" 
      :rules="rules"
      class="login-box"
    >
      <div class="login-header">
        <div class="logo">
          <span class="logo-text">御 书 房</span>
        </div>
        <h2>欢迎回来</h2>
        <p class="subtitle">请登录您的账号</p>
      </div>

      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
          size="large"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <UserFilled class="input-icon" />
            </el-icon>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          size="large"
          show-password
          @keydown.enter="handleLogin"
        >
          <template #prefix>
            <el-icon class="el-input__icon">
              <Lock class="input-icon" />
            </el-icon>
          </template>
        </el-input>
        <div class="password-hint" @click="copyToClipboard('123456')">密码是123456</div>
      </el-form-item>

      <el-button
        class="login-button"
        type="primary"
        @click="handleLogin"
        :loading="isLoading"
        size="large"
      >
        登 录
      </el-button>

      <div class="extra-links">
        <a href="#" @click.prevent="handleForget">忘记密码？</a>
        <a href="#" @click.prevent="handleSignIn">注册账号</a>
      </div>
    </el-form>
  </div>
</template>

<style scoped lang="less">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  .login-box {
    width: 400px;
    padding: 40px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    :deep(.el-form) {
      padding: 40px;
      
      .el-form-item {
        margin-bottom: 24px;
        
        .el-input {
          --el-input-bg-color: rgba(255, 255, 255, 0.9);
          --el-input-border-color: #e0e0e0;
          --el-input-hover-border-color: #667eea;
          --el-input-focus-border-color: #667eea;
          
          input {
            height: 48px;
            &::placeholder {
              color: #95a5a6;
            }
          }
        }
      }
    }

    .password-hint {
      color: #667eea;
      font-size: 12px;
      margin-top: 8px;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        color: #764ba2;
        text-decoration: underline;
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 40px;

      .logo {
        margin-bottom: 24px;

        .logo-text {
          font-size: 38px;
          font-family: '华文行楷';
          font-weight: 700;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 1px;
        }
      }

      h2 {
        font-size: 24px;
        color: #2c3e50;
        margin-bottom: 8px;
        margin-top: 10px;
        font-weight: 600;
      }

      .subtitle {
        color: #7f8c8d;
        font-size: 14px;
      }
    }

    .login-button {
      width: 100%;
      height: 40px;
      padding: 14px;
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-bottom: 20px;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 7px 14px rgba(0, 0, 0, 0.1),
                   0 3px 6px rgba(0, 0, 0, 0.08);
      }

      &:active {
        transform: translateY(1px);
      }
    }

    .extra-links {
      display: flex;
      justify-content: space-between;
      font-size: 14px;

      a {
        color: #667eea;
        text-decoration: none;
        transition: color 0.3s ease;

        &:hover {
          color: #764ba2;
          text-decoration: underline;
        }
      }
    }

    // 增加验证错误样式
    :deep(.el-form-item__error) {
      color: #ff6b6b;
      font-size: 12px;
      margin-top: 4px;
      padding-left: 4px;
    }

    :deep(.el-input.is-error) {
      --el-input-border-color: #ff6b6b;
      
      input {
        box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.1);
      }
    }

    :deep(.el-input__prefix) {
      display: flex;
      align-items: center;
      left: 12px;
      
      .input-icon {
        width: 1.2em;
        height: 1.2em;
        color: #667eea;
        transition: color 0.3s ease;
      }
    }

    :deep(.el-input__wrapper) {
      padding-left: 40px;
      
      &:hover {
        .input-icon {
          color: #764ba2;
        }
      }
      
      &:focus-within {
        .input-icon {
          color: #5a4fcf;
        }
      }
    }
  }
}

// 更新响应式设计
@media (max-width: 480px) {
  .login-container {
    padding: 16px;
    background: linear-gradient(150deg, #667eea 0%, #764ba2 100%);
    
    .login-box {
      width: 100% !important;
      padding: 24px 20px !important;
      margin: 0 auto;
      border-radius: 12px;
      
      .login-header {
        margin-bottom: 32px;
        
        .logo {
          margin-bottom: 16px;
          
          .logo-text {
            font-size: 36px;
          }
        }
        
        h2 {
          font-size: 20px;
          margin-bottom: 6px;
        }
        
        .subtitle {
          font-size: 13px;
        }
      }
      
      .login-box {
        :deep(.el-form) {
          padding: 24px 20px !important;
          
          .el-form-item {
            margin-bottom: 20px;
            
            .el-input input {
              height: 44px;
              font-size: 15px;
            }
          }
        }
        
        .password-hint {
          font-size: 11px;
        }

        :deep(.el-form-item__error) {
          font-size: 11px;
        }

        :deep(.el-input__prefix) {
          left: 10px;
          
          .input-icon {
            width: 1.1em;
            height: 1.1em;
          }
        }
        
        :deep(.el-input__wrapper) {
          padding-left: 36px;
        }
      }
    }
  }
}

// 添加横屏样式
@media (max-width: 896px) and (orientation: landscape) {
  .login-container {
    padding: 16px 24px;
    
    .login-box {
      max-width: 460px;
      margin: 0 auto;
      
      .login-header {
        margin-bottom: 24px;
      }
      
      .login-box {
        :deep(.el-form) {
          padding: 24px 20px !important;
          
          .el-form-item {
            margin-bottom: 16px;
          }
        }
      }
    }
  }
}

// 添加安全区域支持
@supports (padding: max(0px)) {
  .login-container {
    padding-left: max(20px, env(safe-area-inset-left));
    padding-right: max(20px, env(safe-area-inset-right));
    padding-bottom: max(20px, env(safe-area-inset-bottom));
  }
}
</style>