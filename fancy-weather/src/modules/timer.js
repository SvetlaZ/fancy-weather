const moment = require('moment-timezone');

// console.log(moment().tz('Europe/Paris').format());
const timer = (tz, position) => setInterval(() => {
  let time = moment();

  if (tz) {
    time = time.tz(tz);
  }
  if (position) {
    const pos = position;
    pos.innerText = time.format('ddd Do MMMM, HH:mm:ss');
  }
}, 1000);

export default timer;
