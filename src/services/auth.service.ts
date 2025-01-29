import mongoose from "mongoose";
import AccountModel from "../models/account.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/role-permission.model";
import { Roles } from "../enums/role.enum";
import { NotFoundException } from "../utils/appError";
import MemberModel from "../models/member.model";

export const loginOrCreateAccountService = async (data: {
    provider: string;
    displayName: string;
    providerId: string;
    picture?: string;
    email: string;
}) => {
    const { provider, displayName, providerId, picture, email } = data;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        console.log("Starting transaction...");

        let user = await UserModel.findOne({ email });

        if (!user) {
            //Create a new user if it doesn't exist
            user = new UserModel({
                email,
                name: displayName,
                profilePicture: picture,
            });
            await user.save({ session });

            const account = new AccountModel({
                provider,
                providerId,
                user: user._id,
            });
            await account.save({ session });

            // Create a new workspace for the user
            const workspace = new WorkspaceModel({
                name: "My Workspace",
                description: `Workspace for created ${user.name}`,
                owner: user._id,
            });
            await workspace.save({ session });

            const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(session);
            if (!ownerRole) {
                throw new NotFoundException("Owner role not found");
            }

            const member = new MemberModel({
                user: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            });
    }
    } catch (error) {
    await session.abortTransaction();
    throw error;
}


}