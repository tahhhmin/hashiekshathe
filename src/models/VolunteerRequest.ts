import mongoose from "mongoose";

const volunteerRequestSchema = new mongoose.Schema({
    //personal information
    firstName: {},
    lastName: {},
    middleName: {},
    dateOfBirth: {},
    gender: {},
    personalImage: {},
    address: {},

    //contact infromation
    email: {},
    contactNumber: {},
    facebookLink: {},
    intsagramLink: {},
    linkedInLink: {},

}, { timestamps: true });


const VolunteerRequest = mongoose.models.volunteerRequest || mongoose.model("volunteer request", volunteerRequestSchema);
export default VolunteerRequest;