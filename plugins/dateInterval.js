function interval(date1, date2) {
	if (date1 > date2) {
		var result = interval(date2, date1);

		result.years = -result.years;
		result.months = -result.months;
		result.days = -result.days;
		result.hours = -result.hours;

		return result;
	}

	result = {
		years: date2.getYear() - date1.getYear(),
		months: date2.getMonth() - date1.getMonth(),
		days: date2.getDate() - date1.getDate(),
		hours: date2.getHours() - date1.getHours()
	};

	if (result.hours < 0) {
		result.days--;
		result.hours += 24;
	}

	if (result.days < 0) {
		let copy = new Date(date1.getTime());

		result.months--;
		copy.setDate(32);
		result.days = 32 - date1.getDate() - copy.getDate() + date2.getDate();
	}

	if (result.months < 0) {
		result.years--;
		result.months += 12;
	}

	return result;
}

export default interval;