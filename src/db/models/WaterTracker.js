import { model, Schema } from 'mongoose';

const WaterTrackerSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
      default: 0,
    },
    dateTime: {
      type: String,
    },
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },

  { timestamps: true, versionKey: false },
);

const WaterTrackerCollection = model('waterTracker', WaterTrackerSchema);
export default WaterTrackerCollection;
