const mongoose = require("mongoose")
const Schema = mongoose.Schema

const templateSchema = new Schema({
    name: { type: String, required: true },
    subject: { type: String },
    description: { type: String, required: true },
    template_key: { type: String, required: true, unique: true },
    from: { type: String, required: true },
    html: { type: String, required: true },
    variables: [{ type: String, required: true }],
    meetingLink: { type: String }
})

const Template = mongoose.model("Template", templateSchema)
module.exports = Template