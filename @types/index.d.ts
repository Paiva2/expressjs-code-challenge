import { Request, Response } from "express";

export type RoutesSchema = {
  path: string;
  method: string;
  handler: (req: Request, res: Response) => void;
};
