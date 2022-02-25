const ics = require('ics')
const sgMail = require('@sendgrid/mail')
const Template = require('../model/Template')
const moment = require("moment")


const emailHelper = {}

emailHelper.createTemplateIfNotExist = async (props) => {
    let template = await Template.findOne({ template_key: props.template_key })
    if (!template) {
        let email = await Template.create({ ...props })
    }
}



emailHelper.createEvent = async ({ session, variableObj }) => {
    const { mentee, mentor, createdAt } = session
    const start = moment(session.startAt).toArray()
    start[1]++
    const eventTemplate = await Template.findOne({ template_key: "event" }).lean()
    for (let i = 0; i < eventTemplate.variables.length; i++) {
        let key = eventTemplate.variables[i]
        if (variableObj[key]) {
            let re = new RegExp(`%${key}%`, "g")
            eventTemplate.html = eventTemplate.html.replace(re, variableObj[key]);
            session.title = session.title.replace(re, variableObj[key]);
        }
    }
    const event = {
        start: start.slice(0, 5),//[2018, 5, 30, 6, 30],
        duration: { hours: 1 },
        title: session.title,
        description: eventTemplate.html,
        // location: 'Folsom Field, University of Colorado (finish line)',//link to gg meet?
        status: 'CONFIRMED',
        organizer: {
            name: mentor.name, email: mentor.email
        },
        alarms: [{ action: 'display', description: 'Reminder', trigger: { minutes: 30, before: true } }],
        recurrenceRule: "FREQ=WEEKLY",
        attendees: [
            // { ...mentee, rsvp: true, partstat: "ACCEPTED", role: "REQ-PARTICIPANT" }
            { name: mentee.name, email: mentee.email, rsvp: true, partstat: "ACCEPTED", role: "REQ-PARTICIPANT" }
        ],
        // { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
        // { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }

    }
    return event

}

emailHelper.renderEmail = async ({ template_key, variableObj, toEmail, session }) => {
    let msg
    const template = await Template.findOne({ template_key })
    if (!template) throw new Error("Invalid template key")
    for (let i = 0; i < template.variables.length; i++) {
        let key = template.variables[i]
        if (!variableObj[key]) throw new Error("Invalid variable key")
        let re = new RegExp(`%${key}%`, "g")
        template.html = template.html.replace(re, variableObj[key]);
        template.subject = template.subject.replace(re, variableObj[key]);
    }

    if (!session) {
        msg = {
            from: template.from,
            to: "thu.lcm@coderschool.vn",
            subject: template.subject,
            content: [{
                type: "text/plain",
                value: "Plain Content",
            },
            {
                type: "text/html",
                value: template.html,
            }]
        }
    } else {
        const event = await emailHelper.createEvent({ session, variableObj })
        const { value, error } = ics.createEvent(event);
        if (error) {
            console.log(error);
            throw new Error("Something wrong with create event")
        }
        console.log("value", value)
        msg = {
            from: template.from,
            to: toEmail,
            cc: "thu.lcm@coderschool.vn",
            subject: template.subject,
            content: [{
                type: "text/plain",
                value: "Plain Content",
            },
            {
                type: "text/html",
                value: template.html,
            },
            {
                type: "text/calendar; method=REQUEST",
                value,
            }],
            attachments: [
                {
                    content: Buffer.from(value).toString("base64"),
                    type: "application/ics",
                    name: "invite.ics",
                    filename: "invite.ics",
                    disposition: "attachment",
                },
            ],
        }
    }
    return msg
}


emailHelper.send = async (msg) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    await sgMail.send(msg)
    console.log("Email sent")
}


module.exports = emailHelper