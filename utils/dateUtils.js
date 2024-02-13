const moment = require('moment');

const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
};

const getCurrentDate = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
};

const addDaysToDate = (date, days) => {
  return moment(date).add(days, 'days').format('YYYY-MM-DD HH:mm:ss');
};

module.exports = {
  formatDate,
  getCurrentDate,
  addDaysToDate,
};