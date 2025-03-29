// custom-request.interface.ts
import { Request } from 'express';

export interface CustomRequest extends Request {
  user?: {
    id: string;
    // Другие поля пользователя, если есть
  };
}
