

//********************************
// CREATE NEW WORKSPACE

import mongoose from "mongoose";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/role-permission.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundException } from "../utils/appError";

//**************** **************/
export const createWorkspaceService = async (body: { name: string, description?: string | undefined }, userId: any) => {
    const { name, description } = body;

    const user = await UserModel.findById(userId);
    if (!user) {
        throw new NotFoundException("User not found");
    }

    const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });

    if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
    }

    const workspace = new WorkspaceModel(
        {
            name: name,
            description: description,
            owner: user._id,
        }
    );

    await workspace.save();

    const member = new MemberModel({
        user: user._id,
        workspace: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),   
    })

    await member.save();

    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save();

    return { workspace };
}