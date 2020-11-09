document.addEventListener('DOMContentLoaded', () =>
  requestAnimationFrame(updateTime)
)
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}
function zeroFill(n) {
  if (n < 10)
    return '0' + n
  return n;
}
console.log(moment().format("k"))
var hour = parseInt(moment().format("k")) > 13 ? randomNum(16, 18) : randomNum(10, 12);
var minute = zeroFill(randomNum(0, 59));
function updateTime() {
  document.documentElement.style.setProperty('--timer-day', "'" + moment().format("dd") + "'");
  document.documentElement.style.setProperty('--timer-hours', "'" + hour + "'");
  document.documentElement.style.setProperty('--timer-minutes', "'" + minute + "'");
  document.documentElement.style.setProperty('--timer-seconds', "'" + moment().format("ss") + "'");
  requestAnimationFrame(updateTime);
}