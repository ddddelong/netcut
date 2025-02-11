import { loginReq, registerReq } from "@/api/login.ts";
import { queryAllData } from "@/api/netcut.ts";
import type { LoginForm, RegisterForm } from "@/types/login.ts";
import { ElMessage, ElNotification } from "element-plus";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getTime } from "@/utils/time.ts";

const useUserStore = defineStore('user', () => {
	const $router = useRouter()
	const token = ref('')
	const username = ref('')
	const userData = ref<any>()

	// 登陆
	async function login(form: LoginForm) {
		const loginResponse = await loginReq(form)
		if (loginResponse.code === 200) {
			token.value = loginResponse.data.accessToken
			username.value = loginResponse.data.username
			await getUserInfo(username.value)
			ElNotification.success({
				title: getTime(),
				message: `欢迎回来，${username.value}`,
				duration: 3000
			})
			// 优先跳转到重定向地址，没有则跳首页
			await $router.replace($router.currentRoute.value.query.redirect?.toString() || '/')
		} else {
			ElMessage.error(loginResponse.message)
		}
	}

	const getUserInfo = async (username: string) => {
		const result = await queryAllData(username)
		if (result.code === 200) {
			userData.value = result.data
		}
	}

	async function logout() {
		token.value = ''
		username.value = ''
		await $router.replace('/login')
	}

	async function register(formData: RegisterForm) {
		try {
			// 处理注册成功后的逻辑
			const registerResponse = await registerReq(formData);
			if (registerResponse.code === 200) {
				ElMessage.success('注册成功')
				await login(formData)
			} else {
				ElMessage.error(registerResponse.message)
			}
		} catch (error) {
			throw error;
		}
	}

	return {
		token,
		username,
		userData,
		login,
		logout,
		register
	};
}, {
	persist: true   // 启用持久化插件
})
export default useUserStore