import { ElMessage } from "element-plus";
// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage({
      type: 'success',
      message: '已誊抄至奏折！恭请陛下御览～📖✨',
      customClass: 'imperial-message'
    })
  } catch (err) {
    ElMessage({
      type: 'error',
      message: '誊抄失败！速传文房四宝候旨～🖌️🚨',
      customClass: 'imperial-message'
    })
  }
}

export { copyToClipboard }