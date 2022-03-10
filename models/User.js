const dayjs = require("dayjs");
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

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

        availableDay = await User.aggregate([
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
                console.log("temp", temp)
                return temp
            })
            let x = []
            let haveSession = false
            console.log("dayRange", dayRange)

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
            console.log("dayRange", dayRange)

            availableDay[0].ranges = x
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

/**
 * after unwind availability.ranges
{
    _id:62188d4fe4515491604cb10e
    name:"Tan"
    email:"tan.vo@coderschool.com"
    role:"mentor"
    availability:{
        day:"Monday"
        ranges:{
            startTime:2022-03-02T13:30:00.000+00:00
            endTime:2022-03-02T19:30:00.000+00:00
            _id:62208a55f46c7edb69b648b8
        }
        _id:62208a55f46c7edb69b648b7
        newRanges: ["18:30", "20:00", "20:30"]
    } 
    sessions: {
        _id:6220df41432bcb38748fa092
        mentor:62188d4fe4515491604cb10e
        mentee:621890478675393c1368680f
        startAt:2022-02-10T15:00:00.000+00:00
        endAt:2021-02-10T16:00:00.000+00:00
        title:"Meeting between mentor and mentee"
        description:"talk about the project"
        isCanceled:false
        isCompleted:false
    }
}




if session startAt hour1 > avai startTime hour2 
&& session endAt hour3 > avai endTime hour4
ranges :  [{
    start: hour1 //13
    end: hour2 // 15
},{
    start: hour2+1// 16
    end: hour3//21
}]

if hour1 = hour2 
ranges:{
    start: hour1+1
    end: hour3
}

{
    warehouses: [{k: warehouse1, v: 25000}, {k: warehouse2, v: 25000} ]
}
[
    {warehouses: {k: warehouse1, v: 25000}},
    { warehouses: {k: warehouse1, v: 25000}}
]


 */
