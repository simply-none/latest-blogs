module.exports = {
	formatTimestamp(time) {
		var date = new Date(time);

		var year = date.getFullYear(),
			month = (date.getMonth() + 1 + '').padStart(2, '0'), //月份是从0开始的
			day = ('' + date.getDate()).padStart(2, '0'),
			hour = ('' + date.getHours()).padStart(2, '0'),
			min = ('' + date.getMinutes()).padStart(2, '0'),
			sec = ('' + date.getSeconds()).padStart(2, '0');
		var newTime =
			year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec;
		return newTime;
	},
};
