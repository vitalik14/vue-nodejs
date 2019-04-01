
const Schema = require("validate");
const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const checkNumber = (val) => {
	if (!!Number(val)) return true;
	else return false;
};

const checkNumberRange = (val) => {
	if (val > 1 && val < 300) return true;
	else return false;
};

const checkBirthday = (val) => {
	if (new Date().getTime() > Number(val)) {
		return true;
	} else {
		return false;
	}
};

const registration = new Schema({
	email: {
		type: String,
		required: true,
		match: validEmail,
		message: {
			type: "Email must be a string.",
			required: "Email is required.",
			match: "Email no valid.",
		}
	},
	pass: {
		type: String,
		required: true,
		length: { min: 5, max: 32 },
		message: {
			type: "Password must be a string.",
			required: "Password is required.",
			length: "Password length a error"
		}
	},
	nameChild: {
		type: String,
		required: true,
		length: { min: 2, max: 14 },
		message: {
			type: "Name child must be a string.",
			required: "Name child is required.",
			length: "Mistake in length child's name"
		}
	},
	gender: {
		required: true,
		enum: ['1', '2'],
		message: {
			required: "Gender is required.",
			enum: "Mistake in Gender value"
		}
	},
	birthday: {
		required: true,
		message: {
			required: "Birthday is required."
		}
	},
	growth: {
		required: true,
		message: {
			required: "Growth is required."
		}
	},
	weight: {
		required: true,
		message: {
			required: "Weight is required."
		}
	},
});

registration.message('checkNumberRange', path => `${path} must be from 1 to 300`);
registration.message(checkBirthday, path => `${path} Birthday no valid date`);
registration.message('checkNumber', path => `${path} must be a number.`);

registration.path('growth').use({ checkNumber, checkNumberRange });
registration.path('weight').use({ checkNumber, checkNumberRange });
registration.path('birthday').use({ checkNumber, checkBirthday });


const login = new Schema({
	email: {
		type: String,
		required: true,
		match: validEmail,
		message: {
			type: "Email must be a string.",
			required: "Email is required.",
			match: "Email no valid.",
		}
	},
	pass: {
		type: String,
		required: true,
		length: {min: 5, max: 33 },
		message: {
			type: "Password must be a string.",
			required: "Password is required.",
			length: "Password length a error"
		}
	}
});

const childOptionsAdd = new Schema({ 
	date: {
		required: true,
		message: {
			required: "Date is required."
		}
	},
	growth: {
		required: true,
		message: {
			required: "Growth is required."
		}
	},
	weight: {
		required: true,
		message: {
			required: "Weight is required."
		}
	},
	comment: {
		type: String,
		length: { max: 1000 },
		message: "Too big comment to the field"
	}
});

childOptionsAdd.message('checkNumberRange', path => `${path} must be from 1 to 300`);
childOptionsAdd.message('checkBirthday', path => `${path} no valid date`);
childOptionsAdd.message('checkNumber', path => `${path} must be a number.`);

childOptionsAdd.path('growth').use({ checkNumber, checkNumberRange });
childOptionsAdd.path('weight').use({ checkNumber, checkNumberRange });
childOptionsAdd.path('date').use({ checkNumber, checkBirthday });

const feedingAdd = new Schema({ 
	start: {
		required: true,
		message: {
			required: "Start time is required.",
		}
		
	},
	end: {
		required: true,
		message: {
			required: "End time is required.",
		}
	},
	chest: {
		required: true,
		enum: [1, 2],
		message: {
			required: "Chest is required.",
			enum: "Mistake in Chest value"
		}
	}
});
feedingAdd.path('start').use({ checkNumber, checkBirthday });
feedingAdd.path('end').use({ checkNumber, checkBirthday });



const types = {
	registration,
	login,
	childOptionsAdd,
	feedingAdd
};


function validate(obj, type) {
	let result = [];
	const errors = types[type].validate(obj);

	if (errors.length) {
		errors.map((el) => {
			result.push(el.message);
		});
		return {
			result,
			status: false,
		};
	}
	return {
		result,
		status: true,
	};
}
//sample // validate(obj, 'login');

module.exports = validate;
