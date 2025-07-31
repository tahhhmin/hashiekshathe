import mongoose from "mongoose";
import slugify from "slugify";

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },

    location: {
        city: { type: String, required: true },
        division: { type: String },
        country: { type: String, default: "Bangladesh" }
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date },
    description: { type: String, required: true },

    tags: [{ type: String, required: true }],

    thumbnailURL: { type: String, required: true },
    bannerURL: { type: String, required: true },
    galleryURL: [{ type: String, required: true }],
    financialRecordURL: { type: String, required: true },

    impact: {
        peopleServed: { type: Number, default: 0 },
        volunteersEngaged: { type: Number, default: 0 },
        materialsDistributed: { type: Number, default: 0 }
    },

    volunteers: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        hours: { type: Number, default: 0 },
        certificateURL: { type: String },
        impactDescription: { type: String }
    }],

    collaborators: [{
        name: { type: String, required: true },
        logoURL: { type: String },
        website: { type: String }
    }],

    sponsors: [{
        name: { type: String, required: true },
        logoURL: { type: String },
        website: { type: String }
    }],

    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed'],
        default: 'Upcoming'
    },

    isPublic: { type: Boolean, default: true }

}, { timestamps: true });

projectSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default Project;
