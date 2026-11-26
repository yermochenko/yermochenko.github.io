export default {
	title: 'Главная',
	url: ['/index.html', '/'],
	children: [{
		title: 'Алгоритмизация и программирование',
		abbr: 'АиП',
		url: '/algorithmization-and-programming/index.html',
		children: [{
			title: 'Упражнение №1. Блок-схемы алгоритмов',
			abbr: 'Упражнение №1',
			url: '/algorithmization-and-programming/labs/lab-1-algorithm-flowchart/index.html'
		}, {
			title: 'Упражнение №2. Представление информации в памяти компьютера',
			abbr: 'Упражнение №2',
			url: '/algorithmization-and-programming/labs/lab-2-information-representation/index.html'
		}, {
			title: 'Упражнение №3. Эмулятор процессора',
			abbr: 'Упражнение №3',
			url: '/algorithmization-and-programming/labs/lab-3-emulator/index.html'
		}, {
			title: 'Эмулятор процессора',
			abbr: 'Эмулятор',
			url: '/algorithmization-and-programming/other/emulator/index.html'
		}]
	}, {
		title: 'Языки программирования C/C++ (базовый уровень)',
		abbr: 'C/C++[B]',
		url: '/c-and-c++/index.html',
		children: [{
			title: 'Упражнение №1. Линейные алгоритмы',
			abbr: 'Упражнение №1',
			url: '/c-and-c++/labs/lab-1-linear-algorithms/index.html'
		}, {
			title: 'Упражнение №2. Разветвляющиеся алгоритмы',
			abbr: 'Упражнение №2',
			url: '/c-and-c++/labs/lab-2-branching-algorithms/index.html'
		}]
	}]
};
