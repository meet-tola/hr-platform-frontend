import mongoose, { Schema, Document } from "mongoose";
import { RoleDocument } from "./role-permission.model";

export interface MemberDocument extends Document {
    user: mongoose.Types.ObjectId;
    workspace: mongoose.Types.ObjectId;
    role: RoleDocument;
    joinedAt: Date;
}

const memberSchema = new Schema<MemberDocument>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        workspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const MemberModel = mongoose.model<MemberDocument>("Member", memberSchema);
export default MemberModel;