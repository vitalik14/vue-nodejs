const fields = {
	nameChild: "String",
	email: "String",
	pass: "String",
	birthday: "Number",
	gender: "Number",
	avatar: "String",
	growth: "Number",
	weight: "Number",
	comment: "String"
};

function check(o, types = fields) {
	try {
		for (let i in o) {
			if (types[i] && typeof o[i] !== types[i].toLocaleLowerCase()) {
				let n = eval(types[i])(o[i]);

				if (n) {
					o[i] = n;
				} else {
					throw new Error(
						`the field "${i}" is not type "${types[i]}"`
					);
				}
			}
		}
	} catch (e) {
		return e.message;
	}

	return false;
}

module.exports = check;
