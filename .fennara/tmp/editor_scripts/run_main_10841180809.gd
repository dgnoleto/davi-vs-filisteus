@tool
extends RefCounted

func run(ctx) -> void:
	var root: Node = ctx.get_scene_root()
	if root == null:
		ctx.error("Scene root was null")
		return

	# 1. Background setup
	var bg: Sprite2D = root.get_node_or_null("Background") as Sprite2D
	if bg == null:
		bg = Sprite2D.new()
		bg.name = "Background"
		root.add_child(bg)
		ctx.own(bg)
		ctx.log("Created Background Sprite2D")
	
	var bg_tex: Texture2D = load("res://assets/scenarios/cenario.png") as Texture2D
	bg.texture = bg_tex
	bg.position = Vector2(640.0, 340.0)
	bg.scale = Vector2(2.15, 2.15)
	bg.z_index = -10
	root.move_child(bg, 0)
	ctx.log("Configured Background position=(640, 340), scale=(2.15, 2.15), z_index=-10")

	# 2. Ground StaticBody2D setup
	var ground: StaticBody2D = root.get_node_or_null("Ground") as StaticBody2D
	if ground == null:
		ground = StaticBody2D.new()
		ground.name = "Ground"
		root.add_child(ground)
		ctx.own(ground)
		ctx.log("Created Ground StaticBody2D")
	
	ground.position = Vector2(640.0, 580.0)
	
	var ground_col: CollisionShape2D = ground.get_node_or_null("CollisionShape2D") as CollisionShape2D
	if ground_col == null:
		ground_col = CollisionShape2D.new()
		ground_col.name = "CollisionShape2D"
		ground.add_child(ground_col)
		ctx.own(ground_col)
		ctx.log("Created Ground CollisionShape2D")
	
	var ground_shape: RectangleShape2D = RectangleShape2D.new()
	ground_shape.size = Vector2(2400.0, 100.0)
	ground_col.shape = ground_shape
	ground_col.position = Vector2(0.0, 50.0)
	ctx.log("Configured Ground collision at Y=580 (surface)")

	# 3. Davi adjustments
	var davi: CharacterBody2D = root.get_node_or_null("Davi") as CharacterBody2D
	if davi != null:
		davi.position = Vector2(260.0, 580.0)
		ctx.log("Set Davi position to (260, 580)")
		
		var davi_sprite: Sprite2D = davi.get_node_or_null("Sprite2D") as Sprite2D
		if davi_sprite != null:
			davi_sprite.scale = Vector2(0.12, 0.12)
			davi_sprite.offset = Vector2(0.0, -768.0)
			ctx.log("Configured Davi Sprite2D scale=(0.12, 0.12), offset=(0, -768)")
		
		var davi_col: CollisionShape2D = davi.get_node_or_null("CollisionShape2D") as CollisionShape2D
		if davi_col != null:
			var capsule: CapsuleShape2D = CapsuleShape2D.new()
			capsule.radius = 28.0
			capsule.height = 160.0
			davi_col.shape = capsule
			davi_col.position = Vector2(0.0, -80.0)
			ctx.log("Configured Davi CollisionShape2D CapsuleShape2D radius=28, height=160 at (0, -80)")

	# 4. Camera2D setup
	var cam: Camera2D = root.get_node_or_null("Camera2D") as Camera2D
	if cam == null:
		cam = Camera2D.new()
		cam.name = "Camera2D"
		root.add_child(cam)
		ctx.own(cam)
		ctx.log("Created Camera2D")
	
	cam.position = Vector2(640.0, 360.0)
	cam.enabled = true
	ctx.log("Configured Camera2D at (640, 360)")

	ctx.mark_modified()
