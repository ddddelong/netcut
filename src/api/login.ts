import { http } from "@/utils/request";
import type {LoginForm, LoginRespond} from "@/types/login.ts";
import { API_URL } from "@/api/index.ts";

export function loginReq(data: LoginForm) {
  return http.post<LoginRespond>(API_URL.login, JSON.stringify(data));
}
