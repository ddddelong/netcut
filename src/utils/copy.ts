import {ElMessage} from "element-plus";
// 复制到剪贴板
const copyToClipboard = async (text: string) => {
	try {
		await navigator.clipboard.writeText(text)
		ElMessage.success('复制成功')
	} catch (err) {
		ElMessage.error('复制失败')
	}
}

export {copyToClipboard}