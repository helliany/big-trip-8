import moment from 'moment';

const getTime = ({dateFrom, dateTo}) => {
  const from = moment(dateFrom);
  const to = moment(dateTo);
  const difference = moment.duration(to.diff(from));
  const durationHs = parseInt(difference.asHours(), 10);
  const hours = difference.hours() >= 10 ? `${difference.hours()}h` : `0${difference.hours()}h`;
  const minutes = difference.minutes() >= 10 ? `${difference.minutes()}m` : `0${difference.minutes()}m`;
  const days = difference.days() > 10 ? `${difference.days()}d` : `0${difference.days()}d`;
  const months = difference.months() > 10 ? `${difference.months()}m` : `0${difference.months()}m`;
  const duration = `${parseInt(months, 10) > 0 ? months : ``} ${parseInt(days, 10) > 0 ? days : ``} ${parseInt(hours, 10) > 0 ? hours : ``} ${parseInt(minutes, 10) > 0 ? minutes : ``}`;

  return {
    from: from.format(`HH:mm`),
    to: to.format(`HH:mm`),
    duration,
    durationHs,
  };
};

const getIcon = (icons, title) => icons.find((item) => item.name === title).icon;

const getNewData = (elements, i, data) => {
  elements[i] = Object.assign({}, elements[i], data);
  return elements[i];
};

export {
  getTime,
  getIcon,
  getNewData,
};
