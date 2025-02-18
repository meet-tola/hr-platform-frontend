import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { Request, Response } from "express";
import { createWorkspaceSchema } from "../validation/workspace.validation";
import { createWorkspaceService } from "../services/workspace.service";
import { HTTPSTATUS } from "../config/http.config";

export const createWorkspace = asyncHandler(
async (req: Request, res: Response) => {
  const body = createWorkspaceSchema.parse(req.body);

  const userId = req.user?._id;
  const { workspace } = await createWorkspaceService(body, userId);
  return res.status(HTTPSTATUS.CREATED).json({
    message: "Workspace created successfully",
    workspace,
  });
}
)