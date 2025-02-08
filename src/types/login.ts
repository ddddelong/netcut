interface LoginForm {
  username: string;
  password: string;
}


interface LoginRespond {
  code: number;
  message: string;
  data: {
    username: string;
    token: string;
    refresh_token: string;
  };
  success: boolean;
}
export type { LoginForm, LoginRespond };
