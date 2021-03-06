
const emailTemplate = {}

emailTemplate.ics = `<!DOCTYPE html>
<html lang='en' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'>

<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
    <meta name='x-apple-disable-message-reformatting'>
    <title></title>
    <style>
        .btn-red:hover {
            background-color: #e9635e !important;

        }

        .btn-green:hover {
            background-color: #9ad1b5 !important;

        }

        html,
        body {
            margin: 0;
            padding: 0;
            height: 100%;

        }

        table,
        td,
        div,
        h1,
        p {
            font-family: Arial, Helvetica, sans-serif;

        }
    </style>
</head>

<body>
    <table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%' style='background-image:
        url(https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8auto=formatfit=cropw=1203q=80);
        background-position: center; background-size: cover; padding: 20px;'>
        <tbody>
            <tr>
                <td align='center'>
                    <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px'>
                        <tbody>
                            <tr style='background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(3px);'>
                                <td align='center' valign='top' style='padding: 20px 0px 10px 0px;'>
                                    <img alt='Example' src='https://docs.coderschool.vn/assets/logo-CS-color.png' style='display:
                                        block; width: 100%; max-width: 150px; filter: drop-shadow(0px 1px 0px black);'
                                        border='0'>
                                </td>
                            </tr>
                            <tr>
                                <td valign='top' style=' padding: 0px 50px 20px 50px;
                                    background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(3px); '>

                                    <p style=' color: white; font-size: 30px; font-weight:
                                        bold; margin: 0; '> 60-min Meeting with %mentee% </p>
                                </td>
                            </tr>
                            <tr style='background-color: rgba(0, 0, 0, 0.4); backdrop-filter:
                                blur(3px);'>
                                <td valign='top' style='padding: 0px 50px 50px 50px;'>

                                    <p style=' color: white; font-family: sans-serif; font-size:
                                        16px; font-weight: normal; line-height: 24px; margin: 0; '> Hi
                                        %mentor%, <br> Thank you for being an amazing mentor! </p>
                                </td>
                            </tr>
                            <tr style='background-color: rgba(255, 255, 255, 0.6); backdrop-filter:
                                blur(3px);'>
                                <td style='padding: 50px 50px 50px 50px;'>
                                    <h3>Event Details:</h3>
                                    <ul style='padding: 0; list-style-type: none;'>
                                        <li><strong>Mentee:</strong>
                                            %mentee%</li>
                                        <li> <strong>Start Date / Time:</strong> %startAt% </li>
                                        <li><strong>Location:</strong> %meetingLink%</li>
                                        <li><strong>Student Recap:</strong> <a style='color:#71b592'
                                                href='https://forms.gle/GQKQDP4DqpQZHMSa7'>Click here</a>
                                        </li>
                                        <li><strong>Mentor Recap:</strong> <a style='color:#71b592'
                                                href='https://forms.gle/x6TXSytLPzHvvKHUA'>Click here</a>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                            <tr style='color: white; background-color: rgba(0, 0, 0, 0.4);
                                backdrop-filter: blur(3px);'>
                                <td style='padding: 50px 50px 50px 50px;'>
                                    <h4>
                                        Please let us know
                                        when you Start or Reschedule / Cancel your session </h4>
                                    <div style='text-align: center;'>
                                        <a href='%checkInLink%' target='_blank'>
                                            <button class='btn-green' style=' color: white;
                                                border: none; padding: 10px 35px; font-weight: bold; width:
                                                13rem; margin: 0.3rem 0; background-color: #71b592; cursor:
                                                pointer '> Check In </button></a>
                                        <a href='%cancelLink%' target='_blank'>
                                            <button class='btn-red' style=' color: white;
                                                border: none; padding: 10px 35px; font-weight: bold; width:
                                                13rem; margin: 0.3rem 0; background-color: #d74742; cursor:
                                                pointer '> Reschedule / Cancel </button>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td align='center' style='padding: 10px; color: white'>
                                    <div>
                                        <small>Sonatus Building, 15 Le Thanh Ton,<br>Ben Nghe Ward, District 1,
                                            HCMC</small>
                                    </div>
                                    <div></div>
                                    <div> <small>?? 2022 CoderSchool. All
                                            Rights Reserved</small> </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
`
emailTemplate.icsMentee = `<!DOCTYPE html>
<html lang='en' xmlns='http://www.w3.org/1999/xhtml' xmlns:o='urn:schemas-microsoft-com:office:office'>

<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width,initial-scale=1'>
    <meta name='x-apple-disable-message-reformatting'>
    <title></title>
    <style>
        .btn-red:hover {
            background-color: #e9635e !important;

        }

        .btn-green:hover {
            background-color: #9ad1b5 !important;

        }

        html,
        body {
            margin: 0;
            padding: 0;
            height: 100%;

        }

        table,
        td,
        div,
        h1,
        p {
            font-family: Arial, Helvetica, sans-serif;

        }
    </style>
</head>

<body>
    <table border='0' cellpadding='0' cellspacing='0' width='100%' height='100%' style='background-image:
        url(https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8auto=formatfit=cropw=1203q=80);
        background-position: center; background-size: cover; padding: 20px;'>
        <tbody>
            <tr>
                <td align='center'>
                    <table border='0' cellpadding='0' cellspacing='0' width='100%' style='max-width: 600px'>
                        <tbody>
                            <tr style='background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(3px);'>
                                <td align='center' valign='top' style='padding: 20px 0px 10px 0px;'>
                                    <img alt='Example' src='https://docs.coderschool.vn/assets/logo-CS-color.png' style='display:
                                        block; width: 100%; max-width: 150px; filter: drop-shadow(0px 1px 0px black);'
                                        border='0'>
                                </td>
                            </tr>
                            <tr>
                                <td valign='top' style=' padding: 0px 50px 20px 50px;
                                    background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(3px); '>

                                    <p style=' color: white; font-size: 30px; font-weight:
                                        bold; margin: 0; '> 60-min Meeting with %mentee% </p>
                                </td>
                            </tr>
                            <tr style='background-color: rgba(0, 0, 0, 0.4); backdrop-filter:
                                blur(3px);'>
                                <td valign='top' style='padding: 0px 50px 50px 50px;'>

                                    <p style=' color: white; font-family: sans-serif; font-size:
                                        16px; font-weight: normal; line-height: 24px; margin: 0; '> Hi
                                        %mentor%, <br> Thank you for being an amazing learner! </p>
                                </td>
                            </tr>
                            <tr style='background-color: rgba(255, 255, 255, 0.6); backdrop-filter:
                                blur(3px);'>
                                <td style='padding: 50px 50px 50px 50px;'>
                                    <h3>Event Details:</h3>
                                    <ul style='padding: 0; list-style-type: none;'>
                                        <li><strong>Mentee:</strong>
                                            %mentee%</li>
                                        <li><strong>Mentor:</strong>
                                            %mentor%</li>
                                        <li> <strong>Start Date / Time:</strong> %startAt% </li>
                                        <li><strong>Location:</strong> %meetingLink%</li>
                                        <li><strong>Student Recap:</strong> <a style='color:#71b592'
                                                href='https://forms.gle/GQKQDP4DqpQZHMSa7'>Click here</a>
                                        </li>
                                        <li><strong>Mentor Recap:</strong> <a style='color:#71b592'
                                                href='https://forms.gle/x6TXSytLPzHvvKHUA'>Click here</a>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                            <tr style='color: white; background-color: rgba(0, 0, 0, 0.4);
                                backdrop-filter: blur(3px);'>
                                <td style='padding: 50px 50px 50px 50px;'>
                                    <h4>
                                        Please let us know
                                        when you Start or Reschedule / Cancel your session </h4>
                                    <div style='text-align: center;'>
                                        <a href='%checkInLink%' target='_blank'>
                                            <button class='btn-green' style=' color: white;
                                                border: none; padding: 10px 35px; font-weight: bold; width:
                                                13rem; margin: 0.3rem 0; background-color: #71b592; cursor:
                                                pointer '> Check In </button></a>
                                        <a href='%cancelLink%' target='_blank'>
                                            <button class='btn-red' style=' color: white;
                                                border: none; padding: 10px 35px; font-weight: bold; width:
                                                13rem; margin: 0.3rem 0; background-color: #d74742; cursor:
                                                pointer '> Reschedule / Cancel </button>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td align='center' style='padding: 10px; color: white'>
                                    <div>
                                        <small>Sonatus Building, 15 Le Thanh Ton,<br>Ben Nghe Ward, District 1,
                                            HCMC</small>
                                    </div>
                                    <div></div>
                                    <div> <small>?? 2022 CoderSchool. All
                                            Rights Reserved</small> </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>`
emailTemplate.event = `Hi %mentee%,<br>You have booked a 60-min Meeting with %mentor%<br><br>When: %startAt%<br><br>Additional notes: %description%<br><br>Need to reschedule or cancel?<br>%cancelLink%`
emailTemplate.overlap = `Hi Thu,<br> %user1% and %user2% session has been overlapped at %startAt%`
emailTemplate.reschedule = `Hi %mentee%,<br> You are not able to reschedule your session within 24 hours. This session will be canceled this week. <br> We are so sorry about this, please book your session next week with your mentor.`
module.exports = emailTemplate