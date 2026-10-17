@tool
extends RefCounted

func run(ctx) -> void:
	var root: Node = ctx.get_scene_root()
	if root == null:
		var new_root: RigidBody2D = RigidBody2D.new()
		new_root.name = "Stone"
		ctx.set_scene_root(new_root)
		root = new_root
		ctx.log("Created scene root Stone")
	
	var stone_script: Script = load("res://scripts/Stone.gd") as Script
	root.set_script(stone_script)
	
	var col: CollisionShape2D = CollisionShape2D.new()
	col.name = "CollisionShape2D"
	var circle: CircleShape2D = CircleShape2D.new()
	circle.radius = 8.0
	col.shape = circle
	root.add_child(col)
	ctx.own(col)
	
	var phys_mat: PhysicsMaterial = PhysicsMaterial.new()
	phys_mat.bounce = 0.35
	phys_mat.friction = 0.5
	(root as RigidBody2D).physics_material_override = phys_mat
	
	ctx.log("Configured Stone: radius=8, bounce=0.35, friction=0.5, script attached")
	ctx.mark_modified()
