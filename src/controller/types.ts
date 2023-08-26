import { Request, Response, NextFunction } from 'express'
import { UserDoc } from '../model/User'

type UserRequest = {
  user: UserDoc
  io: {
    emit(event: string, ...args: any[]): void
    disconnect(): void
  }
}

export type UserHandler<T = {}> = (
  req: Request & UserRequest & T,
  res: Response,
  next: NextFunction
) => void

export type NormalHandler<T = {}> = (
  req: Request & T,
  res: Response,
  next: NextFunction
) => void
