@tool
extends RefCounted

func run(ctx) -> void:
	var cam: Camera2D = ctx.root.get_node("Camera2D") as Camera2D
	var img_16_9: Image = await ctx.capture(ctx.root, {"camera": cam})
	ctx.output(img_16_9, "Main Scene Framed (16:9 - 1280x720)")
