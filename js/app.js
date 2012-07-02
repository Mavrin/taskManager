yepnope({
	load: ["js/res/jquery-1.7.2.min.js", "js/ui/jquery.ui.core.min.js", "js/ui/jquery.ui.widget.min.js", "js/ui/jquery.ui.mouse.min.js", "js/ui/jquery.ui.draggable.min.js", "js/ui/jquery.ui.droppable.min.js","js/storage.js","js/res/jquery.tmpl.min.js","js/jquery.ui.taskManager.js"],
	complete: function() {
		$('body').taskManager({storage:storage});
	}
});