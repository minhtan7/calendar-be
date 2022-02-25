const dayjs = require("dayjs");
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = Schema({
    name: String,
    email: { type: String, unique: true, require: true },
    role: { type: String, enum: ["mentor", "mentee"], required: true },
    mentorSessions: { type: Number },
    usedSessions: { type: Number },
    availability: [
        {
            day: String,
            ranges: [{
                startTime: Date,
                endTime: Date
            }]
        }
    ],
    sessions: [{
        type: Schema.Types.ObjectId
    }]
},
    { timestamps: true }
)



userSchema.statics.findOrCreate = async (profile) => {
    let user = await User.findOne({ email: profile.email })
    if (!user && profile.role === "mentor") {
        const defaultDay = new Date(0)
        const defaultRange = [{
            startTime: defaultDay,
            endTime: defaultDay
        }]

        const weekDay = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ]


        const availability = weekDay.map((day) => {
            return {
                day,
                ranges: defaultRange
            }
        }
        )
        user = await User.create({ ...profile, availability })
        return user
    } else if (!user && profile.role === "mentee") {
        user = await User.create({ ...profile, mentorSessions: 4, usedSessions: 0 })
        return user
    }
    return user
};

userSchema.methods.getAvailability = async function (date) {
    if (date) {
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let newDate = dayjs(date).day()
        const availableDay = this.availability.filter(a => {
            return a.day.toLowerCase() === weekDays[newDate].toLowerCase()
        })

        const x = await User.aggregate([
            {
                $match: { _id: this._id }
            },
            {
                $unwind: {
                    path: "$sessions"
                }
            },
            {
                $lookup: {
                    from: "sessions",
                    localField: "sessions",
                    foreignField: "_id",
                    as: "sessions"
                }
            },
            {
                $unwind: "$availability"
            },
            {
                $unwind: "$availability.ranges"
            }
        ])
        // console.log("x", x)
        console.log("sessions", x[0].sessions)
        console.log("avai", x[3].availability.ranges)
        if (availableDay.length) {
            return availableDay
        } else {
            return availableDay //XXX: create a default one later
        }
    } else {
        return this.availability
    }

}

const User = mongoose.model("User", userSchema)
module.exports = User