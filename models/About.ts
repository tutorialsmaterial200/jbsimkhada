import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  title: string;
  content: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AboutSchema = new Schema<IAbout>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.About ||
  mongoose.model<IAbout>("About", AboutSchema);