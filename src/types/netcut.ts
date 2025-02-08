interface Data {
  date: string;
  name: string;
  description: string;
  username?: string
}

interface Result {
  code: number;
  message: string;
  data: Data[];
  success: boolean;
}

enum ResultCode {
  SUCCESS = 200,
  ERROR = 500,
  VALIDATE_FAILED = 404,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

interface DeleteData {
  username: string
  name: string;
}
export type { Data, DeleteData, Result };
export { ResultCode };
