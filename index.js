const app = require("./app")
const User = require('./models/User');
const dayjs = require("dayjs")
var isoWeek = require('dayjs/plugin/isoWeek');
const utilsHelper = require("./helper/ultils.helper");
const Session = require('./models/Sessions');

dayjs.extend(isoWeek)




app.get('/:mentorId/availability', async (req, res, next) => {
    let date = req.query.date;
    const { mentorId } = req.params
    const user = await User.findById(mentorId)
    const availability = await user.getAvailability(date)
    console.log("avai", availability)
    res.send({
        status: 200,
        ranges: availability
    })

});
app.get('/mentor/:id', async (req, res, next) => {
    const { id } = req.params
    const mentor = await User.findById(id).select({ name: 1, email: 1 })
    res.send({ mentor })
});
app.get('/mentee/:id', async (req, res, next) => {
    const { id } = req.params
    const mentee = await User.findById(id).select({ name: 1, email: 1 })
    res.send({ mentee })
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
    } catch {
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
    if (triggerEvent === "BOOKING") {
        const session = await Session.create({ ...req.body.payload })
        await User.findByIdAndUpdate(mentor, {
            $push: { sessions: session._id }
        })
        await User.findByIdAndUpdate(mentee, {
            $push: { sessions: session._id }
        })
    }

    utilsHelper.sendResponse(res, 200, true, null, null, "Session is created!");
}
)


exports.cloud = app
