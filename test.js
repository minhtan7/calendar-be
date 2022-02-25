const dayjs = require("dayjs")
const { Dayjs, ConfigType } = require("dayjs")
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

console.log(dayjs(0).utc().format())