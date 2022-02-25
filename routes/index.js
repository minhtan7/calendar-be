var express = require('express');
const User = require('../models/User');
const dayjs = require("dayjs")
var router = express.Router();
var isoWeek = require('dayjs/plugin/isoWeek');
const utilsHelper = require("../helper/ultils.helper");
const Session = require('../models/Sessions');

dayjs.extend(isoWeek)




router.get('/:mentorId/availability', async (req, res, next) => {
  let date = req.query.date;
  const { mentorId } = req.params
  const user = await User.findById(mentorId)
  const availability = await user.getAvailability(date)
  res.send({
    status: 200,
    ranges: availability
  })

});



router.post('/users', async (req, res, next) => {
  try {

    const { name, email, role } = req.body
    const user = await User.findOrCreate(req.body)
    res.status(200).send({ message: `new ${role}`, user });
  } catch (err) {
    res.send(err)
  }
});

router.put('/users/:mentorId/availability', async (req, res, next) => {
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

router.post("/sessions", async (req, res) => {
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


module.exports = router;

// const availability = [
//   {
//     day: "Monday", ranges: [{
//       "startTime": "2022-02-15T04:00:00.038Z",
//       "endTime": "2022-02-15T07:00:00.038Z"
//     }, {
//       "startTime": "2022-02-15T09:00:00.038Z",
//       "endTime": "2022-02-15T10:00:00.038Z"
//     }]
//   },
//   {
//     day: "Tuesday", ranges: [{
//       "startTime": "2022-02-15T09:00:00.038Z",
//       "endTime": "2022-02-15T10:00:00.038Z"
//     }]
//   },
//   {
//     day: "Wednesday", ranges: [{
//       "startTime": "2022-02-15T14:00:00.038Z",
//       "endTime": "2022-02-15T17:00:00.038Z"
//     }]
//   }
// ]

// const sessionbody = {
//   triggerEvent:"BOOKING" / "RESCHEDULE" / "CANCEL",
//   payload: {
//     startAt: date,
//     endAt: date,
//     title: string,
//     description: string,
//     mentor: mentorId,
//     mentee: menteeId
//   }
// }