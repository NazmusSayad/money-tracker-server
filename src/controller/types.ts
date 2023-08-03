import { NextFunction, Request, Response } from 'express'

type UserRequest = {}

export type UserController<T = {}> = (
  req: Request & UserRequest & T,
  res: Response,
  next: NextFunction
) => void
