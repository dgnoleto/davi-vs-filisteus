@tool
extends RefCounted

func run(ctx) -> void:
	var root: Node = ctx.get_scene_root()
	if root == null:
		var new_root: Node2D = Node2D.new()
		new_root.name = "Main"
		ctx.set_scene_root(new_root)
		root = new_root
		ctx.log("Created Main (Node2D) as scene root")

	var davi: CharacterBody2D = CharacterBody2D.new()
	davi.name = "Davi"
	root.add_child(davi)
	ctx.own(davi)
	ctx.log("Added Davi (CharacterBody2D)")

	var sprite: Sprite2D = Sprite2D.new()
	sprite.name = "Sprite2D"
	var tex: Texture2D = load("res://assets/characters/davi/davi-idle-skin-v2.png") as Texture2D
	sprite.texture = tex
	davi.add_child(sprite)
	ctx.own(sprite)
	ctx.log("Added Sprite2D with texture davi-idle-skin-v2.png")

	var collision: CollisionShape2D = CollisionShape2D.new()
	collision.name = "CollisionShape2D"
	davi.add_child(collision)
	ctx.own(collision)
	ctx.log("Added CollisionShape2D")

	ctx.mark_modified()
