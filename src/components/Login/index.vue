<script setup lang="ts">
import {reactive, ref} from 'vue';
import {ElMessage} from "element-plus";
import type {LoginForm} from "@/types/login.ts";
import useUserStore from "@/stores/user.ts"

const loginForm = reactive<LoginForm>({
  username: 'admin',
  password: '',
})
const isLoading = ref(false);

const userStore = useUserStore()

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  isLoading.value = true;
  // 实现登录逻辑
  await userStore.login(loginForm)
  isLoading.value = false
};

// 处理注册
function handleSignIn(): void {
  ElMessage.warning('滚！我没那能力知道吗？')
}

// 处理忘记密码
function handleForget(): void {
  ElMessage.warning('胡闹！你根本没有账号！何来忘记密码一说？')
}

</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="logo">
          <span class="logo-text">NetCut</span>
        </div>
        <h2>欢迎回来</h2>
        <p class="subtitle">请登录您的账号</p>
      </div>
      <div class="input-group">
        <label>用户名</label>
        <input
          v-model="loginForm.username"
          type="text"
          placeholder="请输入用户名"
        >
      </div>
      <div class="input-group">
        <label>密码</label>
        <input
          v-model="loginForm.password"
          type="password"
          placeholder="请输入密码"
          @keydown.enter="handleLogin"
        >
        <div>密码是123456</div>
      </div>
      <el-button
          class="login-button"
          @click="handleLogin"
          :loading="isLoading"
      >
        <span>登 录</span>
      </el-button>
      <div class="extra-links">
        <a href="#" @click="handleForget">忘记密码？</a>
        <a href="#" @click="handleSignIn">注册账号</a>
      </div>
    </div>
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

    .login-header {
      text-align: center;
      margin-bottom: 40px;

      .logo {
        margin-bottom: 24px;

        .logo-text {
          font-size: 32px;
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
        font-weight: 600;
      }

      .subtitle {
        color: #7f8c8d;
        font-size: 14px;
      }
    }

    .input-group {
      margin-bottom: 24px;

      label {
        display: block;
        margin-bottom: 8px;
        color: #2c3e50;
        font-size: 14px;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.9);

        &::placeholder {
          color: #95a5a6;
        }

        &:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }
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
            font-size: 28px;
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
      
      .input-group {
        margin-bottom: 20px;
        
        label {
          font-size: 13px;
          margin-bottom: 6px;
        }
        
        input {
          padding: 10px 14px;
          font-size: 15px;
          border-width: 1.5px;
          
          &::placeholder {
            font-size: 13px;
          }
        }
      }
      
      .login-button {
        padding: 12px;
        font-size: 15px;
        margin-bottom: 16px;
        
        // 增加触摸反馈
        &:active {
          opacity: 0.9;
          transform: scale(0.98);
        }
      }
      
      .extra-links {
        font-size: 13px;
        padding: 0 4px;
        
        a {
          position: relative;
          padding: 4px 0;
          
          // 增加点击区域
          &::before {
            content: '';
            position: absolute;
            top: -8px;
            bottom: -8px;
            left: -12px;
            right: -12px;
          }
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
      
      .input-group {
        margin-bottom: 16px;
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