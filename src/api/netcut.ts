import type { Data, DeleteData, Result } from "@/types/netcut";
import { http } from "@/utils/request";
import { API_URL } from "@/api/index.ts";

// 添加数据（需要处理URL编码）
export const addData = (data: Data) => http.post<Result>(API_URL.addData, data);

// 查询所有数据--->向服务器传用户名
export const queryAllData = async (username: string) => {
  const response = await http.post<Result>(API_URL.queryAll, {username});
  if (response.code === 200 && Array.isArray(response.data)) {
    // 按日期倒序排序，最新的在前面
    response.data.sort((a: Data, b: Data) => {
      const dateA = new Date(`2024-${a.date}`);
      const dateB = new Date(`2024-${b.date}`);
      return dateB.getTime() - dateA.getTime();
    });
  }
  return response;
};

// 删除接口
export const deleteData = (data: DeleteData) =>
  http.delete<Result>(API_URL.deleteData, {
    data,
  });

export const updateData = (data: Data) =>
  http.post<Result>(API_URL.updateData, data);
