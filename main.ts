import express from 'npm:express';
import path from 'node:path';
import { Request, Response } from 'npm:express';

const app = express();
const port = process.env.PORT || 8000;

// 配置静态文件服务
app.use(express.static(path.join(import.meta.dirname, 'dist')));

// 处理前端路由
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(import.meta.dirname, 'dist', 'index.html'));
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});