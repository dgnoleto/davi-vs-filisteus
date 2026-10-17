class_name David
extends CharacterBody2D

signal aim_started(anchor_position: Vector2)
signal aim_updated(pull_vector: Vector2, predicted_velocity: Vector2)
signal stone_launched(stone: RigidBody2D, launch_velocity: Vector2)
signal aim_canceled()

@export var max_pull_radius: float = 120.0
@export var max_pull_down: float = 70.0
@export var min_pull_distance: float = 15.0
@export var touch_grab_radius: float = 80.0
@export var launch_speed_multiplier: float = 8.5
@export var reload_time: float = 0.5
@export var max_active_stones: int = 5
@export var stone_scene: PackedScene = preload("res://scenes/stone.tscn")

@onready var sprite: Sprite2D = $Sprite2D
@onready var collision_shape: CollisionShape2D = $CollisionShape2D
@onready var sling_anchor: Marker2D = $SlingAnchor
@onready var trajectory_line: Line2D = $TrajectoryLine
@onready var sling_band_front: Line2D = $SlingBandFront
@onready var sling_band_back: Line2D = $SlingBandBack

var is_aiming: bool = false
var is_reloading: bool = false
var current_pull: Vector2 = Vector2.ZERO
var _reload_timer: float = 0.0
var _active_pointer_id: int = -1 # -1: nenhum, -2: mouse, >=0: touch_index
var _active_stones: Array[RigidBody2D] = []

func _ready() -> void:
	if sprite:
		sprite.flip_h = true
	if trajectory_line:
		trajectory_line.visible = false
	if sling_band_front:
		sling_band_front.visible = false
	if sling_band_back:
		sling_band_back.visible = false

func _process(delta: float) -> void:
	if is_reloading:
		_reload_timer -= delta
		if _reload_timer <= 0.0:
			is_reloading = false

func _notification(what: int) -> void:
	if what == NOTIFICATION_APPLICATION_FOCUS_OUT or what == NOTIFICATION_WM_WINDOW_FOCUS_OUT:
		cancel_aim()

func _unhandled_input(event: InputEvent) -> void:
	# 1. Suporte a Touch Nativo (Mobile)
	if event is InputEventScreenTouch:
		var touch: InputEventScreenTouch = event
		if touch.canceled:
			if touch.index == _active_pointer_id:
				cancel_aim()
			return
		
		if touch.pressed:
			if _active_pointer_id == -1 and not is_reloading:
				var world_pos: Vector2 = _screen_to_world(touch.position)
				if _is_within_grab_radius(world_pos):
					_start_aim(touch.index, world_pos)
		else:
			if touch.index == _active_pointer_id:
				_finish_aim()
		return
	
	if event is InputEventScreenDrag:
		var drag: InputEventScreenDrag = event
		if drag.index == _active_pointer_id:
			var world_pos: Vector2 = _screen_to_world(drag.position)
			_update_aim(world_pos)
		return
	
	# 2. Suporte a Mouse (Desktop de Apoio)
	if event is InputEventMouseButton:
		var mouse: InputEventMouseButton = event
		if mouse.button_index == MOUSE_BUTTON_LEFT:
			if mouse.pressed:
				if _active_pointer_id == -1 and not is_reloading:
					var world_pos: Vector2 = _screen_to_world(mouse.position)
					if _is_within_grab_radius(world_pos):
						_start_aim(-2, world_pos)
			else:
				if _active_pointer_id == -2:
					_finish_aim()
		return
	
	if event is InputEventMouseMotion:
		var motion: InputEventMouseMotion = event
		if _active_pointer_id == -2:
			var world_pos: Vector2 = _screen_to_world(motion.position)
			_update_aim(world_pos)
		return

func _screen_to_world(screen_pos: Vector2) -> Vector2:
	return get_canvas_transform().affine_inverse() * screen_pos

func _is_within_grab_radius(world_pos: Vector2) -> bool:
	var anchor_pos: Vector2 = get_anchor_global_position()
	return world_pos.distance_to(anchor_pos) <= touch_grab_radius

func get_anchor_global_position() -> Vector2:
	if sling_anchor:
		return sling_anchor.global_position
	return global_position + Vector2(32.0, -80.0)

func _start_aim(pointer_id: int, world_pos: Vector2) -> void:
	_active_pointer_id = pointer_id
	is_aiming = true
	_update_aim(world_pos)
	if trajectory_line:
		trajectory_line.visible = true
	aim_started.emit(get_anchor_global_position())

func _update_aim(world_pos: Vector2) -> void:
	var anchor_pos: Vector2 = get_anchor_global_position()
	var raw_pull: Vector2 = world_pos - anchor_pos
	
	# Limita o puxão em coordenadas lógicas
	var pull_dist: float = raw_pull.length()
	if pull_dist > max_pull_radius:
		raw_pull = raw_pull.normalized() * max_pull_radius
	
	if raw_pull.y > max_pull_down:
		raw_pull.y = max_pull_down
	
	current_pull = raw_pull
	var predicted_vel: Vector2 = -current_pull * launch_speed_multiplier
	
	_update_trajectory_preview(anchor_pos + current_pull, predicted_vel)
	_update_sling_bands(anchor_pos, anchor_pos + current_pull)
	aim_updated.emit(current_pull, predicted_vel)

func _finish_aim() -> void:
	if not is_aiming:
		_active_pointer_id = -1
		return
	
	if current_pull.length() >= min_pull_distance:
		launch_stone(current_pull)
	else:
		cancel_aim()
	
	_active_pointer_id = -1

func cancel_aim() -> void:
	is_aiming = false
	_active_pointer_id = -1
	current_pull = Vector2.ZERO
	if trajectory_line:
		trajectory_line.visible = false
		trajectory_line.clear_points()
	if sling_band_front:
		sling_band_front.visible = false
	if sling_band_back:
		sling_band_back.visible = false
	aim_canceled.emit()

func launch_stone(pull: Vector2) -> RigidBody2D:
	if stone_scene == null:
		cancel_aim()
		return null
	
	var anchor_pos: Vector2 = get_anchor_global_position()
	var spawn_pos: Vector2 = anchor_pos + pull
	var launch_vel: Vector2 = -pull * launch_speed_multiplier
	
	var stone_instance: RigidBody2D = stone_scene.instantiate() as RigidBody2D
	if stone_instance == null:
		cancel_aim()
		return null
	
	var spawn_parent: Node = get_parent()
	if spawn_parent == null:
		spawn_parent = self
	
	stone_instance.add_collision_exception_with(self)
	spawn_parent.add_child(stone_instance)
	stone_instance.global_position = spawn_pos
	stone_instance.linear_velocity = launch_vel
	
	_register_active_stone(stone_instance)
	
	is_reloading = true
	_reload_timer = reload_time
	
	cancel_aim()
	stone_launched.emit(stone_instance, launch_vel)
	return stone_instance

func _register_active_stone(stone: RigidBody2D) -> void:
	_active_stones.append(stone)
	stone.tree_exited.connect(func(): _active_stones.erase(stone))
	
	# Limite máximo de pedras ativas para evitar acúmulo
	if _active_stones.size() > max_active_stones:
		var oldest: RigidBody2D = _active_stones[0]
		if is_instance_valid(oldest):
			oldest.queue_free()

func _update_trajectory_preview(start_pos: Vector2, initial_vel: Vector2) -> void:
	if trajectory_line == null:
		return
	
	trajectory_line.clear_points()
	var gravity_mag: float = ProjectSettings.get_setting("physics/2d/default_gravity", 980.0)
	var gravity_vec: Vector2 = Vector2(0.0, gravity_mag)
	
	var points_count: int = 25
	var dt: float = 0.04
	
	for i: int in range(points_count):
		var t: float = float(i) * dt
		var world_pt: Vector2 = start_pos + initial_vel * t + 0.5 * gravity_vec * t * t
		
		# Limita visualmente ao nível do solo
		if world_pt.y > 670.0:
			world_pt.y = 670.0
			trajectory_line.add_point(trajectory_line.to_local(world_pt))
			break
		
		trajectory_line.add_point(trajectory_line.to_local(world_pt))

func _update_sling_bands(anchor_pos: Vector2, pouch_pos: Vector2) -> void:
	var top_fork: Vector2 = anchor_pos + Vector2(-2.0, -8.0)
	var bottom_fork: Vector2 = anchor_pos + Vector2(2.0, 8.0)
	
	if sling_band_back:
		sling_band_back.visible = true
		sling_band_back.clear_points()
		sling_band_back.add_point(sling_band_back.to_local(top_fork))
		sling_band_back.add_point(sling_band_back.to_local(pouch_pos))
	
	if sling_band_front:
		sling_band_front.visible = true
		sling_band_front.clear_points()
		sling_band_front.add_point(sling_band_front.to_local(bottom_fork))
		sling_band_front.add_point(sling_band_front.to_local(pouch_pos))
