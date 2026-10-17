extends RefCounted

func run(ctx: Variant) -> void:
	var root: Node = ctx.get_scene_root()
	var window: Window = root.get_window()
	var original_size: Vector2i = window.size
	for target_size: Vector2i in [Vector2i(1280, 720), Vector2i(1560, 720)]:
		window.size = target_size
		for frame_index: int in range(4):
			await window.get_tree().process_frame
		root = ctx.get_scene_root()
		window = root.get_window()
		var viewport: Viewport = root.get_viewport()
		var camera: Camera2D = root.get_node("Camera2D") as Camera2D
		var david: CharacterBody2D = root.get_node("Davi") as CharacterBody2D
		var inverse: Transform2D = viewport.get_canvas_transform().affine_inverse()
		ctx.log("Actual window layout", {"requested": str(target_size), "window_size": str(window.size), "viewport_rect": str(viewport.get_visible_rect()), "world_top_left": str(inverse * Vector2.ZERO), "world_bottom_right": str(inverse * viewport.get_visible_rect().size), "camera_zoom": str(camera.zoom), "david_position": str(david.global_position), "sprite_flip_h": (david.get_node("Sprite2D") as Sprite2D).flip_h, "physics_hz": Engine.physics_ticks_per_second})
		await ctx.capture("qa4_actual_%dx%d" % [target_size.x, target_size.y], 0)
	window.size = original_size
	ctx.close_scene()
