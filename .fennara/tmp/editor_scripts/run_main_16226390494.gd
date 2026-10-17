@tool
extends RefCounted

func run(ctx) -> void:
	var root: Node = ctx.get_scene_root()
	if root == null:
		ctx.error("Scene root was null")
		return

	# 1. Davi slingshot components
	var davi: CharacterBody2D = root.get_node_or_null("Davi") as CharacterBody2D
	if davi != null:
		# Anchor
		var anchor: Marker2D = davi.get_node_or_null("SlingAnchor") as Marker2D
		if anchor == null:
			anchor = Marker2D.new()
			anchor.name = "SlingAnchor"
			davi.add_child(anchor)
			ctx.own(anchor)
		anchor.position = Vector2(32.0, -80.0)
		ctx.log("Configured SlingAnchor at (32, -80)")

		# TrajectoryLine
		var traj: Line2D = davi.get_node_or_null("TrajectoryLine") as Line2D
		if traj == null:
			traj = Line2D.new()
			traj.name = "TrajectoryLine"
			davi.add_child(traj)
			ctx.own(traj)
		traj.width = 4.0
		traj.default_color = Color("#56837e")
		traj.z_index = 5
		traj.visible = false
		ctx.log("Configured TrajectoryLine")

		# SlingBandFront
		var band_f: Line2D = davi.get_node_or_null("SlingBandFront") as Line2D
		if band_f == null:
			band_f = Line2D.new()
			band_f.name = "SlingBandFront"
			davi.add_child(band_f)
			ctx.own(band_f)
		band_f.width = 3.0
		band_f.default_color = Color(0.20, 0.45, 0.42)
		band_f.z_index = 6
		band_f.visible = false

		# SlingBandBack
		var band_b: Line2D = davi.get_node_or_null("SlingBandBack") as Line2D
		if band_b == null:
			band_b = Line2D.new()
			band_b.name = "SlingBandBack"
			davi.add_child(band_b)
			ctx.own(band_b)
		band_b.width = 3.0
		band_b.default_color = Color(0.15, 0.35, 0.32)
		band_b.z_index = -1
		band_b.visible = false
		ctx.log("Configured Sling bands")

	# 2. TestTarget setup
	var target: StaticBody2D = root.get_node_or_null("TestTarget") as StaticBody2D
	if target == null:
		target = StaticBody2D.new()
		target.name = "TestTarget"
		root.add_child(target)
		ctx.own(target)
	
	target.position = Vector2(850.0, 620.0)
	var target_script: Script = load("res://scripts/TestTarget.gd") as Script
	target.set_script(target_script)

	var target_col: CollisionShape2D = target.get_node_or_null("CollisionShape2D") as CollisionShape2D
	if target_col == null:
		target_col = CollisionShape2D.new()
		target_col.name = "CollisionShape2D"
		target.add_child(target_col)
		ctx.own(target_col)
	
	var rect: RectangleShape2D = RectangleShape2D.new()
	rect.size = Vector2(40.0, 100.0)
	target_col.shape = rect
	target_col.position = Vector2.ZERO
	ctx.log("Configured TestTarget at (850, 620)")

	ctx.mark_modified()
