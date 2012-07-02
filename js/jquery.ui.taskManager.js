(function($) {
	$.widget("my.taskManager", {
		options: {
			storage: {
				loadData: $.noop,
				save: $.noop,
				drop: $.noop,
				create: $.noop
			},
			tmpl: '<div><div id="item_${id}" class="column__item {{if type.task }}column__item_task{{else}}column__item_bug{{/if}}">\
					<span class="column__item__ico"></span>\
					<div class="column__item__id">${id}</div>\
					<div contentEditable tabindex="100" class="column__item__description">${description}</div>\
					<a title="move" class="column__item__ico_move"></a>\
				</div></div>'
		},
		_renderItem: function(data, column) {
			return $(this.options.tmpl).tmpl(data).prependTo(column);
		},
		_render: function(data) {
			$.each(data, $.proxy(function(index, item) {
				this._renderItem(item, $('.column_' + item.status + ' .column__items'));
			}, this));
		},
		_dragElement: function() {
			$(this).parent().draggable({
				stack: "body",
				revert: true
			});
			$(this).parent().next().addClass('column__item_next');
		},
		_stopDragElement: function() {
			$('.column__item_next').removeClass('column__item_next');
		},
		_focusout: function() {
			var data = $(this).parent().data('tmplItem').data,
				description = $(this).text();
			if (data.description !== description) {
				data.description = description;
				storage.save(data);
			}
		},
		_create: function() {
			var data = this.options.storage.loadData(),
				removeElments = [],
				storage = this.options.storage;
			$.when(data).done($.proxy(function() {
				this._render(data);
				$('.column__item__ico_move').mouseup(this._stopDragElement).mousedown(this._dragElement);

				$('.column__item__description').focusout(this._focusout);
			}, this));


			$('.control_panel__button_undo').click(function() {
				var el = removeElments.pop();
				if (el !== undefined) {
					var status = el.tmplItem().data.status;
					$('.column_' + status + ' .column__items').append(el);
					storage.save(el.tmplItem().data);
				}
			});

			$('.control_panel__button_bug').click($.proxy(function() {
				this._addRecord('bug');
			}, this));

			$('.control_panel__button_task').click($.proxy(function() {
				this._addRecord('task');
			}, this));

			$(".control_panel__button_trash").droppable({
				hoverClass: "ui-state-active",
				drop: function(event, ui) {
					var id = ui.draggable.tmplItem().data['id'];
					storage.drop(ui.draggable.tmplItem().data['id']);
					$('.column__item_first').removeClass('column__item_first');
					removeElments.push(ui.draggable.draggable('destroy').removeAttr('style').detach());
				}
			});

			$(".column").droppable({
				hoverClass: "ui-state-active",
				drop: function(event, ui) {
					ui.draggable.fadeOut('fast', $.proxy(function() {
						ui.draggable.tmplItem().data.status = $(this).data('status');
						storage.save(ui.draggable.tmplItem().data);
						ui.draggable.appendTo($(this).find('.column__items')).fadeIn('fast', function() {
							ui.draggable.draggable('destroy').removeAttr('style');
						});
					}, this));
				}
			});
		},
		_setOption: function(key, value) {
			this._super("_setOption", key, value);
		},
		_addRecord: function(type) {
			$.when(this.options.storage.create(type)).done($.proxy(function(data) {
				var el = this._renderItem(data, $('.column_' + data.status + ' .column__items'));
				el.find('.column__item__ico_move').mouseup(this._stopDragElement).mousedown(this._dragElement);
				el.find('.column__item__description').focus().focusout(this._focusout);;
			}, this));
		},
		destroy: function() {
			return false;
		}
	})
}(jQuery));