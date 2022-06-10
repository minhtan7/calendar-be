const dayjs = require("dayjs");
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const menteeSchema = Schema({
    name: String,
    email: { type: String, unique: true, require: true },
    mentorSessions: { type: Number },
    usedSessions: { type: Number },
    sessions: [{
        type: Schema.Types.ObjectId
    }],
},
    { timestamps: true }
)



menteeSchema.statics.findOrCreate = async (profile) => {
    let mentee = await Mentee.findOne({ email: profile.email })
    if (!mentee && profile.role === "mentee") {
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
        mentee = await Mentee.create({ ...profile, availability })
        return mentee
    } else if (!mentee && profile.role === "mentee") {
        mentee = await Mentee.create({ ...profile, menteeSessions: 4, usedSessions: 0 })
        return mentee
    }
    return mentee
};

menteeSchema.methods.getAvailability = async function (date) {
    if (date) {
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let newDate = dayjs(date).day()

        availableDay = await Mentee.aggregate([
            {
                $match: { _id: this._id, }
            },
            {
                $unwind: "$availability"
            },
            {
                $match: {
                    "availability.day": weekDays[newDate]
                }
            }
            ,
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
            }, {
                $addFields: {
                    startAvailabilityHour: {
                        $hour: {
                            $convert: {
                                input: "$availability.ranges.startTime",
                                to: "date",
                                onError: "Error",
                            }
                        }
                    },
                    endAvailabilityHour: {
                        $hour: {
                            $convert: {
                                input: "$availability.ranges.endTime",
                                to: "date",
                                onError: "Error",
                            }
                        }
                    },
                    startSessionHour: {
                        $hour: { $first: "$sessions.startAt" }
                    },

                    endSessionHour: {
                        $hour: {
                            $first: "$sessions.endAt"
                        }
                    }
                }
            },
            {
                $project: {

                    newAvai: {
                        day: "$availability.day",
                        ranges: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $eq: ["$startAvailabilityHour", "$startSessionHour"] },
                                        { $gte: ["$endAvailabilityHour", "$endSessionHour"] }
                                    ]
                                },
                                then: {
                                    startTime: { $first: "$sessions.endAt" },
                                    endTime: "$availability.ranges.endTime"
                                },
                                else: {
                                    $cond: {
                                        if: {
                                            $and: [
                                                { $lt: ["$startAvailabilityHour", "$startSessionHour"] },
                                                { $gte: ["$endAvailabilityHour", "$endSessionHour"] }
                                            ]
                                        },
                                        then: [
                                            {
                                                startTime: "$availability.ranges.startTime",
                                                endTime: { $first: "$sessions.startAt" }
                                            }, {
                                                startTime: { $first: "$sessions.endAt" },
                                                endTime: "$availability.ranges.endTime"
                                            }
                                        ],
                                        else: "$availability.ranges"
                                    }
                                }
                            }
                        }
                    },

                }
            },
            {
                $unwind: {
                    path: "$newAvai.ranges"
                }
            },
            {
                $group: {
                    _id: {
                        day: "$newAvai.day",
                        startTime: "$newAvai.ranges.startTime",
                        endTime: "$newAvai.ranges.endTime"
                    },
                    day: { $first: "$newAvai.day" },
                    ranges: {
                        $push: "$newAvai.ranges"
                    },
                }
            },
            {
                $group: {
                    _id: "$day",
                    day: { $first: "$day" },
                    ranges: {
                        $push: {
                            $cond: {
                                if: {
                                    $and: [
                                        { $eq: [{ $hour: "$_id.startTime" }, { $hour: "$_id.endTime" }] },
                                        { $ne: ["$_id.startTime", new Date(0)] }
                                    ]
                                },
                                then: "$$REMOVE",
                                else: {
                                    startTime: "$_id.startTime",
                                    endTime: "$_id.endTime",
                                }
                            }
                        }
                    }
                }
            }

        ])
        if (availableDay.length) {
            const dayRange = {}
            for (let i = 0; i < 24; i++) {
                dayRange[dayjs().hour(i).minute(0).format("hh:mm a")] = 0
            }
            console.log("dayRange", dayRange)
            let arrOfRange = availableDay[0].ranges.map((a) => {
                let temp = []
                const start = dayjs().hour(dayjs(a.startTime).hour()).minute(0)
                const end = dayjs().hour(dayjs(a.endTime).hour()).minute(0)
                const diff = end.diff(start, "hour")

                for (let i = 0; i < diff; i++) {
                    const slot = dayjs(a.startTime).add(i * 60, "minutes").format("hh:mm a")
                    dayRange[slot]++
                    temp.push(slot)
                }

                return temp
            })
            let x = []
            let haveSession = false


            for (let item in dayRange) {
                if (dayRange[item] > 1) haveSession = true
            }
            if (haveSession) {
                for (let item in dayRange) {
                    if (dayRange[item] > 1) {
                        x.push({
                            startTime: dayjs(item, "hh:mm a").format(),
                            endTime: dayjs(item, "hh:mm a").add(60, "minutes").format()
                        })
                    }
                }
            } else {
                for (let item in dayRange) {
                    if (dayRange[item] === 1) x.push({
                        startTime: dayjs(item, "hh:mm a").format(),
                        endTime: dayjs(item, "hh:mm a").add(60, "minutes").format()
                    })
                }
            }


            availableDay[0].ranges = x
            return availableDay
        } else {
            return availableDay //XXX: create a default one later
        }
    } else {
        return this.availability
    }

}



const mentee = mongoose.model("Mentee", menteeSchema)
module.exports = Mentee
