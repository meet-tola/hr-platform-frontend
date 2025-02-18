import { Router } from "express";
import { createWorkspace } from "../controllers/workspace.controller";

const workspaceRoutes = Router();

workspaceRoutes.post("/create/new", createWorkspace);

export default workspaceRoutes;