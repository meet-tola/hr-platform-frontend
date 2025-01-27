import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/brcrypt";

export interface UserDocument extends Document {
    name: string
    email: string;
    password?: string;
    profilePicture?: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    createdAt: Date;
    updatedAt: Date;
    currentWorkspace: mongoose.Types.ObjectId | null;
    comparePassword(value: string): Promise<boolean>;
    omitPassword(): Omit<UserDocument, 'password'>;
}

const userSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: true
    },
    profilePicture: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    currentWorkspace: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        default: null
    }
},
    {
        timestamps: true,
    });

userSchema.pre("save", async function (next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) {
        // Hash the password
        if (user.password) {
            const hash = await hashValue(user.password);
            user.password = hash;
        }
    } next();
});

userSchema.methods.omitPassword = function (): Omit<UserDocument, 'password'> {
    const user = this.toObject() as UserDocument;
    delete user.password;
    return user;
}

userSchema.methods.comparePassword = async function (value: string): Promise<boolean> {
    return await compareValue(value, this.password);
}

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;