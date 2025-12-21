import mongoose, { Document, Schema } from 'mongoose';

export interface IEmailOtp extends Document {
  email: string;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
  purpose?: string;
}

const emailOtpSchema = new Schema<IEmailOtp>({
  email: {
    type: String,
    required: true,
    index: true,
    lowercase: true,
    trim: true
  },
  codeHash: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }
  },
  attempts: {
    type: Number,
    default: 0
  },
  purpose: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

emailOtpSchema.index({ email: 1, purpose: 1 });

export default mongoose.model<IEmailOtp>('EmailOtp', emailOtpSchema);
