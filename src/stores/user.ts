import {defineStore} from "pinia";
import {ref} from "vue";
import {loginReq} from "@/api/login.ts";
import {ElMessage} from "element-plus";
import type {LoginForm} from "@/types/login.ts";
import {useRouter} from "vue-router";
import {queryAllData} from "@/api/netcut.ts";


const useUserStore = defineStore('user', ()=>{
	const $router = useRouter()
	const token = ref('')
	const username = ref('')
	const userData = ref<any>()

	// 登陆
	async function login(form: LoginForm) {
		const loginResponse = await loginReq(form)
		if (loginResponse.code === 200) {
			token.value = loginResponse.data.token
			username.value = loginResponse.data.username
			await getUserInfo(username.value)
			ElMessage.success('登陆成功')
			// 优先跳转到重定向地址，没有则跳首页
			await $router.push($router.currentRoute.value.query.redirect?.toString() || '/')
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
		await $router.push('/login')
	}

	return {
		token,
		username,
		userData,
		login,
		logout
	};
}, {
	persist: true   // 启用持久化插件
})
export default useUserStore