var exampleData = [{
	id: 1,
	type: {
		bug: 1
	},
	status: 'todo',
	description: 'Проблема с first-child в IE<9,необходимо вызывать перерисовку'
}, {
	id: 2,
	type: {
		task: 1
	},
	status: 'todo',
	description: 'Добавить в опции настройку зон перетаскивания'
}, {
	id: 3,
	type: {
		bug: 1
	},
	status: 'inProgress',
	description: 'Ошибка кодировки при локальном запуске'
}, {
	id: 4,
	type: {
		task: 1
	},
	status: 'inProgress',
	description: 'Разработка универсально хранилища, используем объект $.Deferred'
}, {
	id: 5,
	type: {
		bug: 1
	},
	status: 'done',
	description: 'Ошибка не подсвечивается область перетаскивания'
}, {
	id: 6,
	type: {
		task: 1
	},
	status: 'done',
	description: 'Продумать интерфейс'
}, {
	id: 7,
	type: {
		task: 1
	},
	status: 'todo',
	description: 'Продумать структуру хранения записей о задаче'
}]
var storage = {
	loadData: function() {
		return exampleData;
	},
	save: function() {

	},
	drop: function() {

	},
	create: function(type) {
		var id = Math.ceil(1000 * Math.random()),
			data = {
				id: id,
				type: {
					task: type === 'task' ? 1 : 0,
					bug: type === 'bug' ? 1 : 0
				},
				status: 'todo',
				description: ''
			};
		return data;
	}
};

if (!($.browser.version == '7.0' && $.browser.msie)) {
	var storage = {
		init: function() {
			$.each(exampleData, $.proxy(function(index, item) {
				if (!this.keyExist(item.id)) {
					localStorage.setItem(item.id, JSON.stringify(item))
				}
			}, this));
		},
		loadData: function() {
			var data = [];
			for (var i = 0, len = localStorage.length - 1, key; i <= len; i++) {
				key = localStorage.key(i);
				data.push(JSON.parse(localStorage.getItem(key)));
			}
			return data;
		},
		save: function(data) {
			localStorage.setItem(data.id, JSON.stringify(data));
		},
		drop: function(id) {
			localStorage.removeItem(id);
		},
		create: function(type) {
			var id = localStorage.length + Math.ceil(1000 * Math.random()),
				data = {
					id: id,
					type: {
						task: type === 'task' ? 1 : 0,
						bug: type === 'bug' ? 1 : 0
					},
					status: 'todo',
					description: ''
				};
			localStorage.setItem(id, JSON.stringify(data));
			return data;
		},
		keyExist: function(key) {
			return localStorage.getItem(key) !== null ? true : false;
		}
	}
	if (!localStorage.length) {
		storage.init();
	}
}