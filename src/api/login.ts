import { http } from "@/utils/request";
import type { LoginForm, LoginRespond } from "@/types/login.ts";
import { API_URL } from "@/api/index.ts";
import type {Result} from "@/types/netcut.ts";

export function loginReq(data: LoginForm) {
  return http.post<LoginRespond>(API_URL.login, JSON.stringify(data));
}

export const registerReq = (data: { username: string; password: string }) => {
  return http.post<Result>(API_URL.register, data);
};
