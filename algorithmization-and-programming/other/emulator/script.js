const MEMORY_SIZE = 128;
const MEMORY_VIEW_COLUMNS_COUNT = 4;
const STACK_SIZE = 8;
const SLOW_RUNNING_TIMEOUT = 750;

class RandomAccessMemory {
	array;
	viewOfMemory;
	viewsOfCells;
	selectedAddress = null;
	editable;

	constructor(size, columnsCount, editable = false) {
		if(!Number.isInteger(size)) {
			throw new Error(`Ошибка памяти: неверный размер – {${size}}\n(тип ${typeof size} а не int)`);
		}
		if(size <= 0) {
			throw new Error(`Ошибка памяти: неверный размер – {${size}}\n(должно быть целое положительное число)`);
		}
		if(!Number.isInteger(columnsCount)) {
			throw new Error(`Ошибка памяти: неверное число столбцов – {${columnsCount}}\n(тип ${typeof columnsCount} а не int)`);
		}
		if(columnsCount <= 0) {
			throw new Error(`Ошибка памяти: неверное число столбцов – {${columnsCount}}\n(должно быть целое положительное число)`);
		}
		if(size % columnsCount != 0) {
			throw new Error(`Ошибка памяти: неверное число столбцов – {${columnsCount}}\n(размер памяти ${size} не кратен числу столбцов)`);
		}
		this.array = new Array(size);
		this.viewsOfCells = new Array(size);
		this.viewOfMemory = document.createElement('table');
		this.viewOfMemory.className = 'ram';
		this.selectedAddress = null;
		this.editable = false;
		let headers = document.createElement('tr');
		for(let j = 0; j < columnsCount; j++) {
			let cellAddress = document.createElement('th');
			cellAddress.appendChild(document.createTextNode('Адрес'));
			headers.appendChild(cellAddress);
			let cellValue = document.createElement('th');
			cellValue.appendChild(document.createTextNode('Значение'));
			headers.appendChild(cellValue);
		}
		this.viewOfMemory.appendChild(headers);
		for(let i = 0, n = size / columnsCount; i < n; i++) {
			let row = document.createElement('tr');
			for(let j = 0; j < columnsCount; j++) {
				let address = n * j + i;
				let cellAddress = document.createElement('td');
				cellAddress.appendChild(document.createTextNode(`${address}:`));
				row.appendChild(cellAddress);
				let cellValue = document.createElement('td');
				cellValue.appendChild(document.createTextNode(''));
				row.appendChild(cellValue);
				this.viewsOfCells[address] = {
					addr: cellAddress,
					val: cellValue
				};
				this.set(address, 0);
			}
			this.viewOfMemory.appendChild(row);
		}
	}

	get(address) {
		this.check(address);
		return this.array[address];
	}

	set(address, value) {
		this.check(address);
		if(Number.isFinite(value)) {
			this.array[address] = value;
			this.viewsOfCells[address].val.replaceChild(document.createTextNode(value), this.viewsOfCells[address].val.firstChild);
		} else {
			throw new Error(`Ошибка памяти: некорректное значение – {${value}}\n(тип ${typeof value}, должно быть корректное конечное вещественное число)`);
		}
	}

	getViewOfMemory() {
		return this.viewOfMemory;
	}

	selectCell(address) {
		this.check(address);
		this.unselectCell();
		this.viewsOfCells[address].addr.classList.add('selected');
		this.viewsOfCells[address].val.classList.add('selected');
		this.selectedAddress = address;
	}

	unselectCell() {
		if(this.selectedAddress != null) {
			this.viewsOfCells[this.selectedAddress].addr.classList.remove('selected');
			this.viewsOfCells[this.selectedAddress].val.classList.remove('selected');
			this.selectedAddress = null;
		}
	}

	isEditable() {
		return this.editable;
	}

	setEditable() {
		if(!this.editable) {
			for(let address = 0, size = this.array.length; address < size; address++) {
				let input = document.createElement('input');
				input.setAttribute('type', 'text');
				input.setAttribute('value', this.array[address]);
				input.setAttribute('id', `cell-${address}`);
				input.setAttribute('tabindex', address + 10);
				this.viewsOfCells[address].val.replaceChild(input, this.viewsOfCells[address].val.firstChild);
			}
			this.editable = true;
		}
	}

	setUneditable() {
		if(this.editable) {
			for(let address = 0, size = this.array.length; address < size; address++) {
				let input = this.viewsOfCells[address].val.firstChild;
				if(input.value) {
					this.set(address, parseFloat(input.value));
				}
			}
			this.editable = false;
		}
	}

	check(address) {
		if(!Number.isInteger(address)) {
			throw new Error(`Ошибка памяти: некорректный адрес – {${address}}\n(тип ${typeof address} а не int)`);
		}
		if(address < 0) {
			throw new Error(`Ошибка памяти: некорректный адрес – {${address}}\n(должно быть число больше либо равное 0)`);
		}
		if(address >= this.array.length) {
			throw new Error(`Ошибка памяти: некорректный адрес – {${address}}\n(число превышает размер памяти ${this.array.length})`);
		}
	}
}

class RegistersStack {
	array;
	top;
	viewOfStack;
	viewsOfCells;

	constructor(size) {
		if(!Number.isInteger(size)) {
			throw new Error(`Ошибка стека регистров: неверный размер – {${size}}\n(тип ${typeof size} а не int)`);
		}
		if(size <= 0) {
			throw new Error(`Ошибка стека регистров: неверный размер – {${size}}\n(должно быть целое положительное число)`);
		}
		this.array = new Array(size);
		this.top = 0;
		this.viewsOfCells = new Array(size);
		this.viewOfStack = document.createElement('table');
		this.viewOfStack.className = 'registers-stack';
		for(let i = size - 1; i >= 0; i--) {
			this.array[i] = 0;
			let row = document.createElement('tr');
			let cellValue = document.createElement('td');
			cellValue.appendChild(document.createTextNode('0'));
			row.appendChild(cellValue);
			this.viewsOfCells[size - i - 1] = cellValue;
			this.viewOfStack.appendChild(row);
		}
		this.top = -1;
	}

	pop() {
		if(this.top < 0) {
			throw new Error(`Ошибка стека регистров: невозможно извлечь значение из пустого стека`);
		}
		let value = this.array[this.top];
		this.array[this.top] = 0;
		let cell = this.viewsOfCells[this.array.length - this.top - 1];
		cell.replaceChild(document.createTextNode('0'), cell.firstChild);
		cell.classList.remove('top');
		this.top--;
		if(this.top >= 0) {
			cell = this.viewsOfCells[this.array.length - this.top - 1];
			cell.classList.add('top');
		}
		return value;
	}

	push(value) {
		if(this.top == this.array.length - 1) {
			throw new Error(`Ошибка стека регистров: невозможно добавить значение в полностью заполненный стек`);
		}
		if(Number.isFinite(value)) {
			let cell = null;
			if(this.top >= 0) {
				cell = this.viewsOfCells[this.array.length - this.top - 1];
				cell.classList.remove('top');
			}
			this.top++;
			this.array[this.top] = value;
			cell = this.viewsOfCells[this.array.length - this.top - 1];
			cell.replaceChild(document.createTextNode(value), cell.firstChild);
			cell.classList.add('top');
		} else {
			throw new Error(`Ошибка стека регистров: некорректное значение – {${value}}\n(тип ${typeof value}, должно быть корректное конечное вещественное число)`);
		}
	}

	getViewOfStack() {
		return this.viewOfStack;
	}
}

class InstructionPointerRegister {
	value;
	viewOfIP;
	viewOfValue;

	constructor() {
		this.value = 0;
		this.viewOfIP = document.createElement('table');
		this.viewOfIP.className = 'ip';
		let row = document.createElement('tr');
		this.viewOfValue = document.createElement('td');
		this.viewOfValue.appendChild(document.createTextNode('0'));
		row.appendChild(this.viewOfValue);
		this.viewOfIP.appendChild(row);
	}

	get() {
		return this.value;
	}

	set(value) {
		if(Number.isInteger(value) && value >= 0) {
			this.value = value;
			this.viewOfValue.replaceChild(document.createTextNode(value), this.viewOfValue.firstChild);
		} else {
			throw new Error(`Ошибка регистра IP: некорректное значение – {${value}}\n(тип ${typeof value}, должно быть целое неотрицательное число)`);
		}
	}

	getViewOfIP() {
		return this.viewOfIP;
	}
}

class CentralProcessorUnit {
	ram;
	stack;
	ip;
	instructionsSet;
	selectionMode;
	viewOfCpu;

	constructor(memorySize, memoryColumnsCount, stackSize) {
		this.selectionMode = false;
		this.ram = new RandomAccessMemory(memorySize, memoryColumnsCount);
		this.stack = new RegistersStack(stackSize);
		this.ip = new InstructionPointerRegister();
		this.instructionsSet = new Map();
		// push number
		this.instructionsSet.set(19, {
			size: 2,
			exec: function(cpu, operand) {
				cpu.getStack().push(operand);
			}
		});
		// push variable
		this.instructionsSet.set(21, {
			size: 2,
			exec: function(cpu, operand) {
				let value = cpu.getRam().get(operand);
				cpu.getStack().push(value);
			}
		});
		// pop variable
		this.instructionsSet.set(23, {
			size: 2,
			exec: function(cpu, operand) {
				let value = cpu.getStack().pop();
				cpu.getRam().set(operand, value);
			}
		});
		// add
		this.instructionsSet.set(34, {
			size: 1,
			exec: function(cpu) {
				let operandY = cpu.getStack().pop();
				let operandX = cpu.getStack().pop();
				let result = operandX + operandY;
				cpu.getStack().push(result);
			}
		});
		// sub
		this.instructionsSet.set(36, {
			size: 1,
			exec: function(cpu) {
				let operandY = cpu.getStack().pop();
				let operandX = cpu.getStack().pop();
				let result = operandX - operandY;
				cpu.getStack().push(result);
			}
		});
		// mul
		this.instructionsSet.set(38, {
			size: 1,
			exec: function(cpu) {
				let operandY = cpu.getStack().pop();
				let operandX = cpu.getStack().pop();
				let result = operandX * operandY;
				cpu.getStack().push(result);
			}
		});
		// div
		this.instructionsSet.set(40, {
			size: 1,
			exec: function(cpu) {
				let operandY = cpu.getStack().pop();
				let operandX = cpu.getStack().pop();
				let result = operandX / operandY;
				cpu.getStack().push(result);
			}
		});
		// mod
		this.instructionsSet.set(42, {
			size: 1,
			exec: function(cpu) {
				let operandY = cpu.getStack().pop();
				let operandX = cpu.getStack().pop();
				let result = operandX % operandY;
				cpu.getStack().push(result);
			}
		});
		// and
		this.instructionsSet.set(50, {
			size: 1,
			exec: function(cpu) {
				let operandY = cpu.getStack().pop();
				let operandX = cpu.getStack().pop();
				let result = operandX && operandY;
				cpu.getStack().push(result);
			}
		});
		// or
		this.instructionsSet.set(52, {
			size: 1,
			exec: function(cpu) {
				let operandY = cpu.getStack().pop();
				let operandX = cpu.getStack().pop();
				let result = operandX || operandY;
				cpu.getStack().push(result);
			}
		});
		// not
		this.instructionsSet.set(54, {
			size: 1,
			exec: function(cpu) {
				let operand = cpu.getStack().pop();
				let result = !operand;
				cpu.getStack().push(result);
			}
		});
		// equal
		this.instructionsSet.set(56, {
			size: 1,
			exec: function(cpu) {
				let operandY = cpu.getStack().pop();
				let operandX = cpu.getStack().pop();
				let result = operandX == operandY ? 1 : 0;
				cpu.getStack().push(result);
			}
		});
		// less
		this.instructionsSet.set(58, {
			size: 1,
			exec: function(cpu) {
				let operandY = cpu.getStack().pop();
				let operandX = cpu.getStack().pop();
				let result = operandX < operandY ? 1 : 0;
				cpu.getStack().push(result);
			}
		});
		// greater
		this.instructionsSet.set(60, {
			size: 1,
			exec: function(cpu) {
				let operandY = cpu.getStack().pop();
				let operandX = cpu.getStack().pop();
				let result = operandX > operandY ? 1 : 0;
				cpu.getStack().push(result);
			}
		});
		// stop
		this.instructionsSet.set(64, {
			size: 1,
			exec: function(cpu) {
				cpu.getIP().set(0);
			}
		});
		// jmp
		this.instructionsSet.set(67, {
			size: 2,
			exec: function(cpu, operand) {
				cpu.getIP().set(operand);
			}
		});
		// jtrue
		this.instructionsSet.set(71, {
			size: 2,
			exec: function(cpu, operand) {
				let flag = cpu.getStack().pop();
				if(flag) {
					cpu.getIP().set(operand);
				}
			}
		});
		// out
		this.instructionsSet.set(82, {
			size: 1,
			exec: function(cpu) {
				let value = cpu.getStack().pop();
				alert(value);
			}
		});
		// in
		this.instructionsSet.set(84, {
			size: 1,
			exec: function(cpu) {
				let value = parseFloat(prompt('Введите число'))
				cpu.getStack().push(value);
			}
		});
		this.viewOfCpu = document.createElement('table');
		let tr = document.createElement('tr');
		let tdRam = document.createElement('td');
		tdRam.className = 'device-state';
		let ramCaption = document.createElement('h3');
		ramCaption.className = 'caption';
		ramCaption.appendChild(document.createTextNode('Память'));
		tdRam.appendChild(ramCaption);
		tdRam.appendChild(this.ram.getViewOfMemory());
		tr.appendChild(tdRam);
		let tdRegisters = document.createElement('td');
		tdRegisters.className = 'device-state';
		let registersStackCaption = document.createElement('h3');
		registersStackCaption.className = 'caption';
		registersStackCaption.appendChild(document.createTextNode('Стек регистров'));
		tdRegisters.appendChild(registersStackCaption);
		tdRegisters.appendChild(this.stack.getViewOfStack());
		let registerIPCaption = document.createElement('h3');
		registerIPCaption.className = 'caption';
		registerIPCaption.appendChild(document.createTextNode('Регистр IP'));
		tdRegisters.appendChild(registerIPCaption);
		tdRegisters.appendChild(this.ip.getViewOfIP());
		tr.appendChild(tdRegisters);
		this.viewOfCpu.appendChild(tr);
	}

	getRam() {
		return this.ram;
	}

	getStack() {
		return this.stack;
	}

	getIP() {
		return this.ip;
	}

	execInstruction() {
		let address = this.ip.get();
		if(this.selectionMode) {
			this.ram.selectCell(address);
		}
		if(address != 0) {
			let instructionCode = this.ram.get(address);
			let instruction = this.instructionsSet.get(instructionCode);
			if(instruction === undefined) {
				throw new Error(`Ошибка выполнения: некорректный код инструкции – {${instructionCode}} под адресу {${address}}`);
			}
			let operand = null;
			if(instruction.size == 2) {
				operand = this.ram.get(address + 1);
			}
			this.ip.set(address + instruction.size);
			instruction.exec(this, operand);
			return true;
		} else {
			if(this.selectionMode) {
				this.ram.unselectCell();
			}
			return false;
		}
	}

	setSelectionMode(mode) {
		this.selectionMode = mode;
	}

	getViewOfCpu() {
		return this.viewOfCpu;
	}
}

function btn(caption, className) {
	let button = document.createElement('button');
	button.setAttribute('type', 'button');
	button.classList.add('button');
	if(className) {
		button.classList.add(className);
	}
	button.classList.add();
	button.setAttribute('disabled', 'disabled');
	button.appendChild(document.createTextNode(caption));
	return button;
}

window.addEventListener('load', function() {
	const content = document.getElementById('content');
	const cpu = new CentralProcessorUnit(MEMORY_SIZE, MEMORY_VIEW_COLUMNS_COUNT, STACK_SIZE);
	content.appendChild(cpu.getViewOfCpu());
	cpu.getRam().setEditable();
	const controls = document.createElement('div');
	controls.className = 'controls';

	const runQuickButton = btn('Запуск', 'button-run');

	const runSlowButton = btn('Анимированный запуск', 'button-run');
	const stopSlowButton = btn('Стоп', 'button-stop');

	const debugStartButton = btn('Отладка', 'button-run');
	const debugNextButton = btn('Следующий шаг', 'button-next');
	const debugStopButton = btn('Стоп', 'button-stop');

	const importButton = btn('Импорт', 'button-io');
	const exportButton = btn('Экспорт', 'button-io');

	const setStartState = function() {
		runQuickButton.removeAttribute('disabled');

		runSlowButton.removeAttribute('disabled');
		stopSlowButton.setAttribute('disabled', 'disabled');

		debugStartButton.removeAttribute('disabled');
		debugNextButton.setAttribute('disabled', 'disabled');
		debugStopButton.setAttribute('disabled', 'disabled');

		importButton.removeAttribute('disabled');
		exportButton.removeAttribute('disabled');
	};

	const setSlowRunningState = function() {
		runQuickButton.setAttribute('disabled', 'disabled');

		runSlowButton.setAttribute('disabled', 'disabled');
		stopSlowButton.removeAttribute('disabled');

		debugStartButton.setAttribute('disabled', 'disabled');
		debugNextButton.setAttribute('disabled', 'disabled');
		debugStopButton.setAttribute('disabled', 'disabled');

		importButton.setAttribute('disabled', 'disabled');
		exportButton.setAttribute('disabled', 'disabled');
	};

	const setDebuggingState = function() {
		runQuickButton.setAttribute('disabled', 'disabled');

		runSlowButton.setAttribute('disabled', 'disabled');
		stopSlowButton.setAttribute('disabled', 'disabled');

		debugStartButton.setAttribute('disabled', 'disabled');
		debugNextButton.removeAttribute('disabled');
		debugStopButton.removeAttribute('disabled');

		importButton.setAttribute('disabled', 'disabled');
		exportButton.setAttribute('disabled', 'disabled');
	};

	runQuickButton.addEventListener('click', function() {
		try {
			cpu.getRam().setUneditable();
			cpu.getIP().set(cpu.getRam().get(0));
			let work;
			do {
				work = cpu.execInstruction();
			} while(work);
			cpu.getRam().setEditable();
		} catch(e) {
			alert(e.message);
			cpu.getRam().setEditable();
		}
	});

	let slowRunningTimeout = null;
	let slowWork = false;

	const slowRunTick = function() {
		try {
			if (slowWork) {
			cpu.getRam().selectCell(cpu.getIP().get());
			slowWork = cpu.execInstruction();
			slowRunningTimeout = setTimeout(slowRunTick, SLOW_RUNNING_TIMEOUT);
			} else {
			cpu.getRam().unselectCell();
			cpu.getRam().setEditable();
			setStartState();
			}
		} catch (e) {
			alert(e.message);
			slowWork = false;
			cpu.getRam().unselectCell();
			cpu.getRam().setEditable();
			setStartState();
		}
	};

	runSlowButton.addEventListener('click', function() {
		setSlowRunningState();
		slowWork = true;
		try {
			cpu.getRam().setUneditable();
			cpu.getIP().set(cpu.getRam().get(0));
			slowRunningTimeout = setTimeout(slowRunTick, SLOW_RUNNING_TIMEOUT);
		} catch(e) {
			alert(e.message);
			slowWork = false;
		}
	});

	stopSlowButton.addEventListener('click', function() {
		slowWork = false;
		if(slowRunningTimeout) {
			clearTimeout(slowRunningTimeout);
			slowRunningTimeout = null;
		}
		cpu.getRam().unselectCell();
		cpu.getRam().setEditable();
		setStartState();
	});

	let debugWork = false;

	debugStartButton.addEventListener('click', function() {
		setDebuggingState();
		debugWork = true;
		try {
			cpu.getRam().setUneditable();
			cpu.getIP().set(cpu.getRam().get(0));
		} catch(e) {
			alert(e.message);
			debugWork = false;
		}
	});

	debugNextButton.addEventListener('click', function() {
		try {
			if(debugWork) {
				cpu.getRam().selectCell(cpu.getIP().get());
				debugWork = cpu.execInstruction();
			} else {
				cpu.getRam().unselectCell();
				cpu.getRam().setEditable();
				setStartState();
			}
		} catch(e) {
			alert(e.message);
			debugWork = false;
			cpu.getRam().unselectCell();
			cpu.getRam().setEditable();
			setStartState();
		}
	});

	debugStopButton.addEventListener('click', function() {
		debugWork = false;
		cpu.getRam().unselectCell();
		cpu.getRam().setEditable();
		setStartState();
	});

	importButton.addEventListener('click', function() {
		let program = prompt('Введите программу.\nПрограмма должна состоять из последовательных\nчисловых значений ячеек памяти, разделённых\nсимволом ";" (точка с запятой).');
		let data = program.split(';').map(cell => parseFloat(cell));
		cpu.getRam().setUneditable();
		data.forEach((value, address) => cpu.getRam().set(address, value));
		cpu.getRam().setEditable();
	});

	exportButton.addEventListener('click', function() {
		cpu.getRam().setUneditable();
		let data = new Array(MEMORY_SIZE);
		for (let address = 0; address < MEMORY_SIZE; address++) {
			data[address] = cpu.getRam().get(address);
		}
		cpu.getRam().setEditable();
		prompt('Текущее состояние памяти:', data.join(';'));
	});

	setStartState();

	const runQuickDiv = document.createElement('div');
	runQuickDiv.appendChild(runQuickButton);
	controls.appendChild(runQuickDiv);

	const runSlowDiv = document.createElement('div');
	runSlowDiv.appendChild(runSlowButton);
	runSlowDiv.appendChild(stopSlowButton);
	controls.appendChild(runSlowDiv);

	const debugDiv = document.createElement('div');
	debugDiv.appendChild(debugStartButton);
	debugDiv.appendChild(debugNextButton);
	debugDiv.appendChild(debugStopButton);
	controls.appendChild(debugDiv);

	const ioDiv = document.createElement('div');
	ioDiv.appendChild(importButton);
	ioDiv.appendChild(exportButton);
	controls.appendChild(ioDiv);

	content.appendChild(controls);
});
