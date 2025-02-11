interface LoginForm {
  username: string;
  password: string;
}


interface LoginRespond {
  code: number;
  message: string;
  data: {
    username: string;
    accessToken: string;
    refreshToken: string;
  };
  success: boolean;
}

export interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
}

export type { LoginForm, LoginRespond };
