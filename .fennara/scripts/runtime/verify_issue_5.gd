extends RefCounted

func run(ctx: Variant) -> void:
	var root: Node = ctx.get_scene_root()
	var window: Window = root.get_window()
	var original_size: Vector2i = window.size
	
	var davi: David = root.get_node("Davi") as David
	var camera: Camera2D = root.get_node("Camera2D") as Camera2D
	var target: TestTarget = root.get_node("TestTarget") as TestTarget
	var ground: StaticBody2D = root.get_node("Ground") as StaticBody2D
	var traj_line: Line2D = davi.get_node("TrajectoryLine") as Line2D
	var anchor: Marker2D = davi.get_node("SlingAnchor") as Marker2D
	var anchor_pos: Vector2 = anchor.global_position
	
	ctx.log("=== INICIO DA VALIDACAO QA ISSUE #5 ===")
	ctx.log("Configuracao inicial", {
		"davi_pos": str(davi.global_position),
		"anchor_pos": str(anchor_pos),
		"target_pos": str(target.global_position),
		"ground_pos": str(ground.global_position),
		"camera_zoom": str(camera.zoom)
	})
	
	# =========================================================================
	# TESTE 1: Evidências visuais de mira e trajetória em 1280x720 e 1560x720
	# =========================================================================
	for target_size: Vector2i in [Vector2i(1280, 720), Vector2i(1560, 720)]:
		window.size = target_size
		for frame: int in range(6):
			await window.get_tree().process_frame
		
		var viewport: Viewport = root.get_viewport()
		var canvas_inv: Transform2D = viewport.get_canvas_transform().affine_inverse()
		var visible_rect: Rect2 = viewport.get_visible_rect()
		
		# Inicia mira via toque/mouse (puxão médio: (-70, 50))
		var screen_touch_pos: Vector2 = viewport.get_canvas_transform() * (anchor_pos + Vector2(-70.0, 50.0))
		var screen_anchor: Vector2 = viewport.get_canvas_transform() * anchor_pos
		
		# Simula início do toque no ponto de ancoragem
		var touch_start: InputEventScreenTouch = InputEventScreenTouch.new()
		touch_start.index = 0
		touch_start.pressed = true
		touch_start.position = screen_anchor
		Input.parse_input_event(touch_start)
		await window.get_tree().process_frame
		
		# Simula arrasto até o ponto de puxão
		var drag_event: InputEventScreenDrag = InputEventScreenDrag.new()
		drag_event.index = 0
		drag_event.position = screen_touch_pos
		Input.parse_input_event(drag_event)
		for frame: int in range(4):
			await window.get_tree().process_frame
		
		ctx.log("Captura de Mira e Trajetoria", {
			"res": str(target_size),
			"window_size": str(window.size),
			"visible_rect": str(visible_rect),
			"world_bounds": "%s ate %s" % [str(canvas_inv * Vector2.ZERO), str(canvas_inv * visible_rect.size)],
			"camera_zoom": str(camera.zoom),
			"is_aiming": davi.is_aiming,
			"traj_visible": traj_line.visible,
			"traj_points_count": traj_line.get_point_count(),
			"current_pull": str(davi.current_pull)
		})
		
		await ctx.capture("issue5_aim_%dx%d" % [target_size.x, target_size.y], 0)
		
		# Cancela a mira para o próximo teste
		davi.cancel_aim()
		await window.get_tree().process_frame

	# Restaura resolução padrão 1280x720 para os testes de física
	window.size = Vector2i(1280, 720)
	for frame: int in range(4):
		await window.get_tree().process_frame
	
	# =========================================================================
	# TESTE 2: Rejeição de segundo toque e cancelamento por perda de foco
	# =========================================================================
	ctx.log("--- Teste de Gestos e Multitouch ---")
	# 1. Dedo 0 inicia toque
	var t0_start: InputEventScreenTouch = InputEventScreenTouch.new()
	t0_start.index = 0
	t0_start.pressed = true
	t0_start.position = root.get_viewport().get_canvas_transform() * anchor_pos
	Input.parse_input_event(t0_start)
	await window.get_tree().process_frame
	
	var t0_drag: InputEventScreenDrag = InputEventScreenDrag.new()
	t0_drag.index = 0
	t0_drag.position = root.get_viewport().get_canvas_transform() * (anchor_pos + Vector2(-60.0, 40.0))
	Input.parse_input_event(t0_drag)
	await window.get_tree().process_frame
	
	var pull_before_multi: Vector2 = davi.current_pull
	
	# 2. Dedo 1 tenta interferir
	var t1_start: InputEventScreenTouch = InputEventScreenTouch.new()
	t1_start.index = 1
	t1_start.pressed = true
	t1_start.position = root.get_viewport().get_canvas_transform() * (anchor_pos + Vector2(100.0, -100.0))
	Input.parse_input_event(t1_start)
	await window.get_tree().process_frame
	
	var t1_drag: InputEventScreenDrag = InputEventScreenDrag.new()
	t1_drag.index = 1
	t1_drag.position = root.get_viewport().get_canvas_transform() * (anchor_pos + Vector2(200.0, -200.0))
	Input.parse_input_event(t1_drag)
	await window.get_tree().process_frame
	
	var pull_after_multi: Vector2 = davi.current_pull
	var multitouch_rejected: bool = (pull_before_multi == pull_after_multi)
	ctx.log("Resultado Multitouch", {
		"multitouch_rejected": multitouch_rejected,
		"active_pointer": davi._active_pointer_id,
		"pull_unchanged": pull_before_multi == pull_after_multi
	})
	
	# 3. Cancelamento de toque sem disparo
	var t0_cancel: InputEventScreenTouch = InputEventScreenTouch.new()
	t0_cancel.index = 0
	t0_cancel.canceled = true
	Input.parse_input_event(t0_cancel)
	await window.get_tree().process_frame
	
	ctx.log("Resultado Cancelamento de Toque", {
		"is_aiming_after_cancel": davi.is_aiming,
		"traj_visible": traj_line.visible,
		"no_accidental_launch": davi._active_stones.size() == 0
	})
	
	# =========================================================================
	# TESTE 3: Três combinações de Força e Ângulo (Previsão vs Realidade)
	# =========================================================================
	ctx.log("--- Teste de Trajetoria Fisica: Previsao vs Realidade ---")
	var combinations: Array[Dictionary] = [
		{"name": "CombA_BaixaForca_AltoAngulo", "pull": Vector2(-40.0, 30.0)},
		{"name": "CombB_MediaForca_ImpactoAlvo", "pull": Vector2(-70.0, 50.0)},
		{"name": "CombC_MaxForca_TiroDireto", "pull": Vector2(-115.0, 25.0)}
	]
	
	for comb: Dictionary in combinations:
		var pull: Vector2 = comb["pull"]
		var comb_name: String = comb["name"]
		
		# Cálculos teóricos
		var p0: Vector2 = anchor_pos + pull
		var v0: Vector2 = -pull * davi.launch_speed_multiplier
		var g: float = ProjectSettings.get_setting("physics/2d/default_gravity", 980.0)
		
		# Lança a pedra
		while davi.is_reloading:
			await window.get_tree().process_frame
		
		var stone: RigidBody2D = davi.launch_stone(pull)
		var initial_stone_vel: Vector2 = stone.linear_velocity
		
		var sample_time: float = 0.4 # Ponto de comparação aos 400ms de voo
		var pred_x_400: float = p0.x + v0.x * sample_time
		var pred_y_400: float = p0.y + v0.y * sample_time + 0.5 * g * sample_time * sample_time
		
		var elapsed: float = 0.0
		var actual_pos_at_sample: Vector2 = Vector2.ZERO
		var sample_recorded: bool = false
		
		var initial_impact_count: int = target.impact_count
		var hit_state: Dictionary = {"hit": false, "pos": Vector2.ZERO}
		
		# Monitora o voo durante 1.2 segundos
		for frame_i: int in range(72):
			var dt: float = 1.0 / 60.0
			await window.get_tree().physics_frame
			elapsed += dt
			
			if not sample_recorded and elapsed >= sample_time and is_instance_valid(stone):
				actual_pos_at_sample = stone.global_position
				sample_recorded = true
			
			if target.impact_count > initial_impact_count and not hit_state["hit"]:
				hit_state["hit"] = true
				hit_state["pos"] = target.last_impact_pos
		
		var err_x: float = abs(actual_pos_at_sample.x - pred_x_400)
		var err_y: float = abs(actual_pos_at_sample.y - pred_y_400)
		
		ctx.log("Resultado Voo " + comb_name, {
			"pull": str(pull),
			"launch_vel": str(initial_stone_vel),
			"pred_pos_400ms": str(Vector2(pred_x_400, pred_y_400)),
			"actual_pos_400ms": str(actual_pos_at_sample),
			"erro_x_px": snapped(err_x, 0.01),
			"erro_y_px": snapped(err_y, 0.01),
			"precisao_aceita": (err_x < 5.0 and err_y < 5.0),
			"atingiu_alvo": hit_state["hit"],
			"pos_impacto_alvo": str(hit_state["pos"])
		})
		
		if comb_name == "CombB_MediaForca_ImpactoAlvo":
			await ctx.capture("issue5_impact_%s" % comb_name, 0)
	
	# =========================================================================
	# TESTE 4: Repetição de disparos e não-acúmulo de projéteis
	# =========================================================================
	ctx.log("--- Teste de Repeticao e Nao-Acumulo de Projeteis ---")
	for rep: int in range(7):
		while davi.is_reloading:
			await window.get_tree().process_frame
		davi.launch_stone(Vector2(-50.0, 30.0))
		await window.get_tree().physics_frame
	
	# Aguarda 1 segundo para atualização do pool de pedras
	for f: int in range(60):
		await window.get_tree().physics_frame
	
	var active_count: int = davi._active_stones.size()
	ctx.log("Resultado Pool de Projeteis", {
		"total_disparos_feitos": 10,
		"pedras_ativas_em_cena": active_count,
		"limite_maximo": davi.max_active_stones,
		"respeitou_limite": (active_count <= davi.max_active_stones)
	})
	
	window.size = original_size
	ctx.close_scene()
	ctx.log("=== FIM DA VALIDACAO QA ISSUE #5 ===")
