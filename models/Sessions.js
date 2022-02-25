const mongoose = require("mongoose")
const Schema = mongoose.Schema

const sessionSchema = Schema({
    mentor: { type: Schema.Types.ObjectId, ref: "User" },
    mentee: { type: Schema.Types.ObjectId, ref: "User" },
    startAt: { type: Date, require: true },
    endAt: { type: Date, require: true },
    title: { type: String },
    description: { type: String },
    mentorJoinAt: { type: Date },
    isCanceled: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false } //session is not completed when mentor not join the session 
},
    { timestamps: true }
)

sessionSchema.methods.markCanceled = async function () {
    if (this.isCanceled) {
        throw new Error("Session has already been canceled.")
    }
    this.isDeleted = true
    await this.save()
}

sessionSchema.methods.mentorCheckin = async function (time) {
    if (this.isCanceled) throw new Error("400 - Session is Deleted!")
    if (!this.mentorJoinAt) {
        this.mentorJoinAt = time;
        await this.save()
    } else {
        throw new Error("400 - Mentor has checked in already.")
    }

}



const Session = mongoose.model("Session", sessionSchema)
module.exports = Session