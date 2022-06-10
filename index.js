const app = require("./app")
const User = require('./models/User');
const dayjs = require("dayjs")
var isoWeek = require('dayjs/plugin/isoWeek');
const utilsHelper = require("./helper/ultils.helper");
const Session = require('./models/Sessions');
const emailHelper = require("./helper/ics.helper");
const moment = require("moment")

dayjs.extend(isoWeek)




app.get('/:mentorId/availability', async (req, res, next) => {
    let date = req.query.date;
    const { mentorId } = req.params
    const user = await User.findById(mentorId)
    // console.log("herere", user)
    const availability = await user.getAvailability(date)
    res.send({
        status: 200,
        ranges: availability
    })

});
app.get('/user/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).populate("sessions")
        console.log("user", user)
        if (user.role === "mentor") {
            utilsHelper.sendResponse(res, 200, true, { mentor: user }, null, 'Get mentor successfully');
        } else {
            utilsHelper.sendResponse(res, 200, true, { mentee: user }, null, 'Get mentor successfully');
        }

    } catch (err) {
        console.log("err", err)
        next(err)
    }

});
app.get('/mentee/:id', async (req, res, next) => {
    try {
        const { id } = req.params
        const mentee = await User.findById(id).select({ name: 1, email: 1 })
        res.send({ mentee })
    } catch (err) {
        console.log("err", err)
        next(err)
    }
});


app.post('/users', async (req, res, next) => {
    try {

        const { name, email, role } = req.body
        const user = await User.findOrCreate(req.body)
        res.status(200).send({ message: `new ${role}`, user });
    } catch (err) {
        res.send(err)
    }
});

app.put('/users/:mentorId/availability', async (req, res, next) => {
    try {
        const { availability } = req.body
        const { mentorId } = req.params
        const user = await User.findByIdAndUpdate(mentorId, {
            availability
        }, {
            new: true
        })

        res.status(200).send({ user })
    } catch (err) {
        res.send(err)
    }
})

app.post("/sessions", async (req, res) => {
    let { triggerEvent } = req.body

    let { startAt, endAt, title, description, mentor, mentee } = req.body.payload
    mentee = await User.findById(mentee)
    mentor = await User.findById(mentor)
    if (!mentor) throw new Error("404 - Mentor not found")
    if (!mentee) throw new Error("404 - Mentee not found")
    let session = await Session.findOne({ ...req.body.payload })
    console.log("session", session)
    if (session) throw new Error("409 - Session's already exists!")

    //create an array of new sessions
    let sessionArr = []
    for (let i = 0; i < mentee.mentorSessions; i++) {
        sessionArr.push({
            mentor: mentor._id,
            mentee: mentee._id,
            startAt: moment(startAt).add(i * 7, "days").format(),
            endAt: moment(endAt).add(i * 7, "days").format(),
            title,
            description,
        })
    }
    await Session.create(sessionArr)

    session = await Session.findOne({
        startAt, mentee: mentee._id, mentor: mentor._id
    }).populate(["mentor", "mentee"])
    let sessionIdArr = await Session.find({ mentee: mentee._id, mentor: mentor._id, isCompleted: false, isCanceled: false }).select({ _id: 1 })
    sessionIdArr = sessionIdArr.map((id) => id._id)
    console.log("sessionArraid", sessionIdArr)

    await User.findByIdAndUpdate(mentor, {
        $addToSet: { sessions: { $each: sessionIdArr } }
    })
    await User.findByIdAndUpdate(mentee, {
        $addToSet: { sessions: { $each: sessionIdArr } }
    })
    const checkInLink = `${process.env.BACK_END_URI}/sessions/check-in/${session._id}`
    const cancelLink = `${process.env.BACK_END_URI}/sessions/cancel/${session._id}`
    const msgMentor = await emailHelper.renderEmail({ template_key: "ics", variableObj: { mentor: mentor.name, mentee: mentee.name, meetingLink: mentor.meetingLink, checkInLink, cancelLink, startAt: moment(startAt).utcOffset("+07:00").format("h:mm a dddd, MMMM Do YYYY"), description }, toEmail: mentor.email, session })
    const msgMentee = await emailHelper.renderEmail({ template_key: "ics-mentee", variableObj: { mentor: mentor.name, mentee: mentee.name, meetingLink: mentor.meetingLink, startAt: moment(startAt).utcOffset("+07:00").format("h:mm a dddd, MMMM Do YYYY"), description }, toEmail: mentee.email, session })
    emailHelper.send(msgMentor)
    emailHelper.send(msgMentee)

    utilsHelper.sendResponse(res, 200, true, null, null, "Session is created!");
}
)

app.use((err, req, res, next) => {
    console.log("ERROR", err);
    const statusCode = err.message.split(" - ")[0];
    const message = err.message.split(" - ")[1];
    if (!isNaN(statusCode)) {
        utilsHelper.sendResponse(res, statusCode, false, null, { message }, null);
    } else {
        utilsHelper.sendResponse(
            res,
            500,
            false,
            null,
            { message: err.message },
            "Internal Server Error"
        );
    }
});


exports.cloud = app
