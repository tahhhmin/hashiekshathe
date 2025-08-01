import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({

    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    tags: [{ type: String, required: true }],
    links: [{ type: String }],
    sendMailToAll: {type: Boolean},

}, { timestamps: true });


const Announcement = mongoose.models.announcements || mongoose.model("announcements", announcementSchema);
export default Announcement;