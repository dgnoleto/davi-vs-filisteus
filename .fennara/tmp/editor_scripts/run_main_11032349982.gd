@tool
extends RefCounted

func run(ctx) -> void:
	var cam: Camera2D = ctx.root.get_node("Camera2D") as Camera2D
	
	# 1. Capture 16:9 (1280x720 standard baseline)
	cam.zoom = Vector2(1.0, 1.0)
	var img_16_9: Image = await ctx.capture(ctx.root, {"camera": cam})
	ctx.output(img_16_9, "Proporcao 16:9 (1280x720 - Baseline Mobile/Desktop)")
	
	# 2. Capture 19.5:9 (1560x720 mobile ultrawide framing preview)
	# Zoom.x ajustado para 1280/1560 ~= 0.8205 para simular a expansao horizontal do canvas_items expand
	cam.zoom = Vector2(1280.0 / 1560.0, 1.0)
	var img_19_5_9: Image = await ctx.capture(ctx.root, {"camera": cam})
	ctx.output(img_19_5_9, "Proporcao 19.5:9 (1560x720 - Visao Ultrawide Mobile Expand)")
	
	# Restaura o zoom padrao da camera
	cam.zoom = Vector2(1.0, 1.0)
