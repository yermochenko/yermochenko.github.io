window.addEventListener('load', function() {
	let content = document.getElementById('content');

	/*
	 * взять номер варианта из строки запроса
	 */
	const getVariantFromParams = function(queryString) {
		if(queryString) {
			let params = new URLSearchParams(queryString);
			let variant = params.get('variant');
			return variant ? parseInt(variant) : -1;
		} else {
			return -2;
		}
	};

	/*
	 * сгенерировать случайное число
	 */
	let MyRandomNumber = 0;

	const MyRandomize = function(start) {
		MyRandomNumber = start;
	};

	const MyRnd = function() {
		MyRandomNumber = 111.111 * MyRandomNumber + Math.PI;
		MyRandomNumber = MyRandomNumber - Math.floor(MyRandomNumber);
		return MyRandomNumber;
	};

	/*
	 * сгенерировать число в заданной системе
	 * счисления с заданным количеством цифр
	 */
	const Digits = '0123456789ABCDEF';

	/*
	 * преобразовать число в десятичную систему счисления
	 */
	const convertToDecimal = function(number, radix) {
		let res = 0;
		let r = 0;
		for(let i = 0; i < number.length; i++) {
			let digit = Digits.indexOf(number.charAt(i));
			if(number.charAt(i) == '.') {
				r = 1;
			} else {
				r *= radix;
			}
			if(digit >= 0) {
				res = res * radix + digit;
			}
		}
		return (r == 0) ? res : res / r;
	};

	/*
	 * преобразовать число в заданную систему счисления
	 */
	const convertFromDecimal = function(number, radix) {
		let count = (arguments.length > 2) ? arguments[2] : 5;
		let res = '';
		let r = number - Math.floor(number);
		let digit = 0;
		do {
			digit = number % radix;
			number = Math.floor(number / radix);
			res = Digits.charAt(digit) + res;
		} while(number != 0);
		if(r > 0) {
			res = res + '.';
			for(let i = 0; r > 0 && i < count; i++) {
				r *= radix;
				digit = Math.floor(r);
				r -= digit;
				res += Digits.charAt(digit);
			}
		}
		return res;
	};

	/*
	 * преобразовать число из одной системы счисления в другую
	 */
	const convertNumber = function(number, radixFrom, radixTo) {
		return (arguments.length > 3) ?
		       convertFromDecimal(convertToDecimal(number, radixFrom), radixTo, arguments[3]) :
		       convertFromDecimal(convertToDecimal(number, radixFrom), radixTo);
	};

	/*
	 * дополнить число нулями до заданного количества разрядов
	 */
	const alignNumber = function(number, size) {
		number = number.toString();
		while(number.length < size) {
			number = '0' + number;
		}
		return number;
	};

	const check = function() {
		let formElement = this.parentNode;
		let n = formElement.elements.length - 1;
		for(let i = 0; i < n; i++) {
			element = formElement.elements[i];
			j = parseInt(element.id);
			if(element.value == ans[j]) {
				element.className = 'correct';
			} else {
				element.className = 'incorrect';
			}
		}
	};

	const clear = function(node) {
		while(node.firstChild) {
			node.removeChild(node.firstChild);
		}
	};

	const generateForm = function(taskNumber, description, exercises) {
		let form = document.createElement('form');
		form.setAttribute('id', `task${taskNumber}`);
		let title = document.createElement('p');
		let caption = document.createElement('strong');
		caption.appendChild(document.createTextNode(`Задание\u00A0${taskNumber}:`));
		title.appendChild(caption);
		title.appendChild(document.createTextNode(' ' + description));
		form.appendChild(title);
		let table = document.createElement('table');
		exercises.forEach(exercise => {
			let row = document.createElement('tr');
			let tdQuestion = document.createElement('td');
			tdQuestion.className = 'task';
			tdQuestion.appendChild(document.createTextNode(`${exercise.question}`));
			row.appendChild(tdQuestion);
			let tdArrow = document.createElement('td');
			tdArrow.className = 'separator';
			tdArrow.appendChild(document.createTextNode('\u2192'));
			row.appendChild(tdArrow);
			let tdAnswer = document.createElement('td');
			tdAnswer.className = 'answer';
			let input = document.createElement('input');
			input.className = 'reset';
			input.setAttribute('type', 'text');
			input.setAttribute('id', `${exercise.number}`);
			input.addEventListener('input', function() {
				input.className = 'reset';
			});
			tdAnswer.appendChild(input);
			row.appendChild(tdAnswer);
			table.appendChild(row);
		});
		form.appendChild(table);
		let button = document.createElement('button');
		button.setAttribute('type', 'button');
		button.addEventListener('click', check);
		button.appendChild(document.createTextNode('Проверить задание'));
		form.appendChild(button);
		return form;
	};

	/*
	 * сгенерировать условие работы
	 */
	let ans;
	let ex;

	const generateTask = function(variant) {
		clear(content);

		MyRandomize(Math.sin(variant));

		let task = 0;
		let exercises = null;
		let x = null;
		ex = 0;
		ans = [];

		let header = document.createElement('h3');
		header.appendChild(document.createTextNode(`Вариант ${variant}`));
		content.appendChild(header);

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let a = Math.floor(20 + 230 * MyRnd());
			ans[ex] = alignNumber(convertFromDecimal(a, 2), 8);
			exercises.push({number: ex, question: a});
		}
		content.appendChild(generateForm(task, 'Преобразуйте целое положительное число в 8-битный двоичный прямой код', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let a = -Math.floor(20 + 100 * MyRnd());
			ans[ex] = '1' + alignNumber(convertFromDecimal(-a, 2), 7);
			exercises.push({number: ex, question: a});
		}
		content.appendChild(generateForm(task, 'Преобразуйте целое отрицательное число в 8-битный двоичный прямой код', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		x = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let a = -Math.floor(20 + 100 * MyRnd());
			x.push(a);
			let c = '1' + alignNumber(convertFromDecimal(-a, 2), 7);
			ans[ex] = 128 - a;
			exercises.push({number: ex, question: c});
		}
		content.appendChild(generateForm(task, 'Преобразуйте 8-битный двоичный прямой код в целое положительное число', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let a = x[i - 1];
			let c = '1' + alignNumber(convertFromDecimal(-a, 2), 7);
			ans[ex] = a;
			exercises.push({number: ex, question: c});
		}
		content.appendChild(generateForm(task, 'Преобразуйте 8-битный двоичный прямой код в целое отрицательное число', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let a = -Math.floor(20 + 100 * MyRnd());
			ans[ex] = convertFromDecimal(256 + a, 2);
			exercises.push({number: ex, question: a});
		}
		content.appendChild(generateForm(task, 'Преобразуйте целое отрицательное число в 8-битный двоичный дополнительный код', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		x = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let a = -Math.floor(20 + 100 * MyRnd());
			x.push(a);
			let b = 256 + a;
			let c = convertFromDecimal(b, 2);
			ans[ex] = b;
			exercises.push({number: ex, question: c});
		}
		content.appendChild(generateForm(task, 'Преобразуйте 8-битный двоичный дополнительный код в целое положительное число', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let a = x[i - 1];
			let c = convertFromDecimal(256 + a, 2);
			ans[ex] = a;
			exercises.push({number: ex, question: c});
		}
		content.appendChild(generateForm(task, 'Преобразуйте 8-битный двоичный дополнительный код в целое отрицательное число', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let z = Math.floor(50000 + 100000 * MyRnd()) / 1000;
			ans[ex] = convertFromDecimal(z, 2, 5);
			exercises.push({number: ex, question: z});
		}
		content.appendChild(generateForm(task, 'Преобразуйте дробное число из десятичной системы счисления в двоичную систему счисления с 5-ю цифрам после точки', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let z = 50 + 100 * MyRnd();
			z = convertFromDecimal(z, 2, 4) + '1';
			ans[ex] = convertToDecimal(z, 2);
			exercises.push({number: ex, question: z});
		}
		content.appendChild(generateForm(task, 'Преобразуйте дробное число из двоичной системы счисления в десятичную систему счисления', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let z = Math.floor(50000 + 250000 * MyRnd()) / 1000;
			ans[ex] = convertFromDecimal(z, 8, 3);
			exercises.push({number: ex, question: z});
		}
		content.appendChild(generateForm(task, 'Преобразуйте дробное число из десятичной системы счисления в восьмиричную систему счисления с 3-мя цифрами после точки', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let z = 50 + 349 * MyRnd();
			z = convertFromDecimal(z, 8, 2);
			ans[ex] = convertToDecimal(z, 8);
			exercises.push({number: ex, question: z});
		}
		content.appendChild(generateForm(task, 'Преобразуйте дробное число из восьмиричной системы счисления в десятичную систему счисления', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let z = Math.floor(50000 + 900000 * MyRnd()) / 1000;
			ans[ex] = convertFromDecimal(z, 16, 3);
			exercises.push({number: ex, question: z});
		}
		content.appendChild(generateForm(task, 'Преобразуйте дробное число из десятичной системы счисления в шестнадцатиричную систему счисления (с 3-мя цифрами после точки)', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let z = 50 + 949 * MyRnd();
			z = convertFromDecimal(z, 16, 2);
			ans[ex] = convertToDecimal(z, 16);
			exercises.push({number: ex, question: z});
		}
		content.appendChild(generateForm(task, 'Преобразуйте дробное число из шестнадцатиричной системы счисления в десятичную систему счисления', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let code = Math.floor(32 + MyRnd() * (128 - 32));
			ans[ex] = convertFromDecimal(code, 16);
			let z = String.fromCharCode(code);
			exercises.push({number: ex, question: z});
		}
		content.appendChild(generateForm(task, 'Запишите код представленного символа в шестнадцатиричной системе счисления', exercises));

		//-------------------------------------------------
		task++;
		exercises = [];
		for(let i = 1; i <= 4; i++) {
			ex++;
			let z = Math.floor(32 + MyRnd() * (128 - 32));
			ans[ex] = String.fromCharCode(z);
			exercises.push({number: ex, question: z});
		}
		content.appendChild(generateForm(task, 'Запишите символ, соответствующий представленному коду в десятичной системе счисления', exercises));
	};

	let variant = getVariantFromParams(location.search);
	if(variant >= 1 && variant <= 30) {
		generateTask(variant);
	} else {
		let table = document.createElement('table');
		table.className = 'variants';
		for(let j = 1; j <= 10; j++) {
			let row = document.createElement('tr');
			for(let i = 1; i <= 3; i++) {
				let cell = document.createElement('td');
				let a = document.createElement('a');
				const url = new URL(location.href);
				url.searchParams.append('variant', `${(i - 1) * 10 + j}`);
				a.href = url.href;
				let text = document.createTextNode(`Вариант ${(i - 1) * 10 + j}`);
				a.appendChild(text);
				cell.appendChild(a);
				row.appendChild(cell);
			}
			table.appendChild(row);
		}
		content.insertBefore(table, content.firstChild);
	}
});
