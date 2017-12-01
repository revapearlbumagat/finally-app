'use strict';

var INIT_ITEMS = [{
	name: 'Todo item 1',
	color: '',
	checked: false,
	edit: false,
	id: 1
}, {
	name: 'Todo item 2',
	color: 'pink',
	checked: false,
	edit: false,
	id: 2
}, {
	name: 'Todo item 3',
	color: 'purple',
	checked: false,
	edit: false,
	id: 3
}];

var COLORS = [{
	name: 'red',
	checked: true,
	id: 1
}, {
	name: 'pink',
	checked: false,
	id: 2
}, {
	name: 'purple',
	checked: false,
	id: 3
}, {
	name: 'blue',
	checked: false,
	id: 4
}, {
	name: 'green',
	checked: false,
	id: 5
}, {
	name: 'yellow',
	checked: false,
	id: 6
}];

var itemId = 4;

function getIndex(value, arr, prop) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i][prop] === value) {
			return i;
		}
	}
	return -1; //to handle the case where the value doesn't exist
}

var Header = React.createClass({
	displayName: 'Header',

	propTypes: {
		title: React.PropTypes.string.isRequired,
		checkedItemsFlag: React.PropTypes.bool.isRequired,
		handleDeleteItems: React.PropTypes.func.isRequired,
		number: React.PropTypes.number
	},

	getDefaultProps: function getDefaultProps() {
		return {
			title: 'Whats Up For Today'
		};
	},

	handleClick: function handleClick(e) {
		e.preventDefault();
		this.props.handleDeleteItems();
	},

	render: function render() {
		var showLinkClass = this.props.checkedItemsFlag ? 'is--visible' : '';
		var number = this.props.number;
		return React.createElement(
			'header',
			null,
			React.createElement(
				'h1',
				{ className: 'clearfix' },
				this.props.title,
				React.createElement(
					'a',
					{
						className: 'float--right text--xs spacer--top--xs text--reg is--hidden ' + showLinkClass,
						href: '#',
						onClick: this.handleClick },
					'Clear Completed Items (',
					number,
					')'
				)
			)
		);
	}
});

var AddItemForm = React.createClass({
	displayName: 'AddItemForm',

	propTypes: {
		onAdd: React.PropTypes.func.isRequired,
		colorList: React.PropTypes.array.isRequired
	},

	getInitialState: function getInitialState() {
		return {
			name: '',
			color: 'red'
		};
	},

	onSubmit: function onSubmit(e) {
		e.preventDefault();

		var name = this.state.name;
		var color = this.state.color;

		if (name != '') {
			this.props.onAdd(name, color);
			this.setState({
				name: '',
				color: 'red'
			});
		}
	},

	onNameChange: function onNameChange(e) {
		this.state.name = e.target.value;
		this.setState(this.state);
	},

	onColorChange: function onColorChange(e) {
		this.state.color = e.target.getAttribute('data-color');
		this.setState(this.state);
	},

	render: function render() {

		var radios = this.props.colorList.map(function (color, index) {
			if (this.state.color == color.name) {
				color.checked = true;
			} else {
				color.checked = false;
			}
			var checkedClass = color.checked ? 'checked' : '';
			return React.createElement('input', { type: 'radio', onChange: this.onColorChange, className: 'colorSelector__inputRadio ' + color.name + ' ' + checkedClass, name: 'selectedColor', 'data-color': color.name, key: color.id });
		}.bind(this));

		return React.createElement(
			'form',
			{ onSubmit: this.onSubmit },
			React.createElement('input', { className: 'form__inputText--lg form__inputText--addItem', type: 'text', name: 'name', value: this.state.name, onChange: this.onNameChange, placeholder: 'Add New Item' }),
			React.createElement(
				'div',
				{ className: 'colorSelector' },
				radios
			),
			React.createElement('input', { className: 'form__inputSubmit--inside', type: 'submit', value: 'Add' })
		);
	}
});

var EditItemForm = React.createClass({
	displayName: 'EditItemForm',

	propTypes: {
		editMode: React.PropTypes.bool.isRequired,
		val: React.PropTypes.string.isRequired,
		colorList: React.PropTypes.array.isRequired,
		color: React.PropTypes.string
	},

	getInitialState: function getInitialState() {
		return {
			newName: this.props.val,
			newColor: this.props.color
		};
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		if (nextProps.editMode === false) {
			this.setState({
				newName: nextProps.val,
				newColor: nextProps.color
			});
		}
	},
	onValueChange: function onValueChange(e) {
		this.state.newName = e.target.value;
		this.setState(this.state);
	},
	onColorChange: function onColorChange(e) {
		this.state.newColor = e.target.getAttribute('data-color');
		this.setState(this.state);
	},
	onSubmit: function onSubmit(e) {
		e.preventDefault();

		var name = this.state.newName;
		var color = this.state.newColor;
		var id = this.props.id;

		if (name != '') {
			this.props.notifyEdits(name, color, id);
		}
	},
	render: function render() {
		var editClass = this.props.editMode ? 'is--show' : '';

		var radios = this.props.colorList.map(function (color, index) {

			var checkedClass = color.name == this.state.newColor ? 'checked' : '';

			return React.createElement('input', { type: 'radio', onChange: this.onColorChange, className: 'colorSelector__inputRadio ' + color.name + ' ' + checkedClass, name: 'selectedColor', 'data-color': color.name, key: color.id });
		}.bind(this));

		return React.createElement(
			'form',
			{ className: 'list__form ' + editClass, onSubmit: this.onSubmit },
			React.createElement('input', {
				className: 'form__inputText--lg form__inputText--addItem',
				type: 'text',
				ref: 'editInput',
				onChange: this.onValueChange,
				value: this.state.newName
			}),
			React.createElement(
				'div',
				{ className: 'colorSelector' },
				radios
			),
			React.createElement('input', { className: 'form__inputSubmit--inside', type: 'submit', value: 'Save' })
		);
	}
});

var Item = React.createClass({
	displayName: 'Item',

	propTypes: {
		name: React.PropTypes.string.isRequired,
		color: React.PropTypes.string,
		checked: React.PropTypes.bool.isRequired,
		edit: React.PropTypes.bool.isRequired,
		id: React.PropTypes.number.isRequired,
		onPassDelete: React.PropTypes.func.isRequired,
		onCheckedCheck: React.PropTypes.func.isRequired,
		editFlag: React.PropTypes.func.isRequired,
		editColorList: React.PropTypes.array.isRequired
	},

	getInitialState: function getInitialState() {
		return {
			clicked: false,
			checked: false,
			editSwitch: false
		};
	},

	handleClick: function handleClick() {
		this.state.clicked = this.state.clicked ? false : true;
		this.setState(this.state);
	},

	handleChange: function handleChange(e) {
		this.state.checked = e.target.checked;
		this.props.onCheckedCheck(this.state.checked, this.props.id);
		this.setState(this.state);
	},

	onEditSwitch: function onEditSwitch() {
		this.state.editSwitch = true;
		this.setState(this.state);
		this.props.editFlag(this.state.editSwitch, this.props.id);
	},

	render: function render() {
		var colorClass = this.props.color ? this.props.color : '';
		var checkedClass = this.state.checked ? 'disabled' : '';

		return React.createElement(
			'li',
			{ className: 'list__item ' + colorClass + ' ' + checkedClass, 'data-id': this.props.id },
			React.createElement(
				'div',
				{ className: 'list__checkbox' },
				React.createElement('input', { type: 'checkbox', onChange: this.handleChange })
			),
			React.createElement(
				'div',
				{ className: 'list__name' },
				React.createElement(
					'p',
					{ className: 'list__text', onClick: this.onEditSwitch },
					this.props.name
				),
				React.createElement(EditItemForm, {
					editMode: this.props.edit,
					val: this.props.name,
					color: this.props.color,
					colorList: this.props.editColorList,
					notifyEdits: this.props.onEdit,
					id: this.props.id
				})
			)
		);
	}
});

var App = React.createClass({
	displayName: 'App',

	propTypes: {
		initialItems: React.PropTypes.array.isRequired,
		colors: React.PropTypes.array.isRequired
	},

	componentDidMount: function componentDidMount() {
		window.addEventListener('click', this.clickOutside);
	},

	getInitialState: function getInitialState() {
		return {
			items: this.props.initialItems,
			countChecked: false,
			checkedNum: 1
		};
	},

	onItemAdd: function onItemAdd(name, color) {
		this.state.items.push({
			name: name,
			color: color,
			checked: false,
			edit: false,
			id: itemId
		});
		this.setState(this.state);
		itemId += 1;
	},

	onItemEdit: function onItemEdit(name, color, id) {
		var array = this.state.items;
		var index = getIndex(id, array, 'id');
		this.state.items[index].name = name;
		this.state.items[index].color = color;
		this.state.items[index].edit = false;
		this.setState(this.state);
		//console.log('new name: ' + name + ' new color: ' + color + ' id: ' + id);
	},

	onItemDelete: function onItemDelete(index) {
		this.state.items.splice(index, 1);
		this.setState(this.state);
	},

	onCheckedChecker: function onCheckedChecker(checked, id) {
		var array = this.state.items;
		var index = getIndex(id, array, 'id');
		var counter = [];

		if (this.state.items[index].edit === true) {
			this.state.items[index].edit = false;
		}
		this.state.items[index].checked = checked;
		this.setState(this.state);

		this.state.items.forEach(function (obj, index) {
			if (obj.checked === true) {
				counter.push(obj);
			}
		});
		if (counter.length > 0) {
			this.state.countChecked = true;
		} else {
			this.state.countChecked = false;
		}
		this.state.checkedNum = counter.length;
	},

	onMultiDelete: function onMultiDelete() {
		var items = this.state.items;
		var keep = [];
		this.state.items.forEach(function (obj, index) {
			if (obj.checked !== true) {
				keep.push(items[index]);
			}
		});
		this.setState({
			items: keep,
			countChecked: false,
			checkedNum: 1
		});
	},

	onEditCheck: function onEditCheck(flag, id) {
		var array = this.state.items;
		var index = getIndex(id, array, 'id');
		var counter = [];

		this.state.items[index].edit = flag;
		this.setState(this.state);

		this.state.items.forEach(function (obj, index) {
			if (obj.edit === true) {
				counter.push(obj);
			}
		});

		if (counter.length > 1) {
			this.state.items.forEach(function (obj, index) {
				obj.edit = false;
			});
			this.state.items[index].edit = true;
			this.setState(this.state);

			counter.splice(0, 1);
		}
	},

	clickOutside: function clickOutside(e) {
		if (!document.querySelector('[data-area]').contains(e.target)) {
			this.state.items.forEach(function (obj, index) {
				if (obj.edit === true) {
					obj.edit = false;
				}
			});
			this.setState(this.state);
		}
	},

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'container' },
			React.createElement(Header, { checkedItemsFlag: this.state.countChecked, number: this.state.checkedNum, handleDeleteItems: this.onMultiDelete }),
			React.createElement(
				'ul',
				{ className: 'list', 'data-area': true },
				this.state.items.map(function (item, index) {
					return React.createElement(Item, {
						name: item.name,
						color: item.color,
						checked: item.checked,
						edit: item.edit,
						key: item.id,
						id: item.id,
						onCheckedCheck: this.onCheckedChecker,
						onPassDelete: function () {
							this.onItemDelete(index);
						}.bind(this),
						editFlag: this.onEditCheck,
						editColorList: this.props.colors,
						onEdit: this.onItemEdit
					});
				}.bind(this))
			),
			React.createElement(AddItemForm, { onAdd: this.onItemAdd, colorList: this.props.colors })
		);
	}
});

ReactDOM.render(React.createElement(App, { initialItems: INIT_ITEMS, colors: COLORS }), document.getElementById('app'));