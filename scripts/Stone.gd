class_name Stone
extends RigidBody2D

signal hit(target: Node2D, impact_position: Vector2, impact_velocity: Vector2)
signal stopped()

@export var max_lifetime: float = 6.0
@export var fade_time_after_stop: float = 1.0
@export var stop_velocity_threshold: float = 15.0

var _time_alive: float = 0.0
var _has_stopped: bool = false
var _stop_timer: float = 0.0
var _has_hit_ground: bool = false

func _ready() -> void:
	contact_monitor = true
	max_contacts_reported = 4
	body_entered.connect(_on_body_entered)
	continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY

func _physics_process(delta: float) -> void:
	_time_alive += delta
	if _time_alive >= max_lifetime:
		queue_free()
		return
	
	# Checagem de limites úteis da arena
	if global_position.x < -400.0 or global_position.x > 2200.0 or global_position.y > 850.0:
		queue_free()
		return
	
	# Checagem de repouso após colidir com o solo
	if _has_hit_ground and not _has_stopped:
		if linear_velocity.length() < stop_velocity_threshold:
			_stop_timer += delta
			if _stop_timer >= 0.5:
				_has_stopped = true
				stopped.emit()
				var tween: Tween = create_tween()
				tween.tween_property(self, "modulate:a", 0.0, fade_time_after_stop)
				tween.tween_callback(queue_free)
		else:
			_stop_timer = 0.0

func _on_body_entered(body: Node) -> void:
	var contact_pos: Vector2 = global_position
	hit.emit(body as Node2D, contact_pos, linear_velocity)
	if body.has_method("register_hit"):
		body.call("register_hit", self, contact_pos, linear_velocity)
	if body.name == "Ground":
		_has_hit_ground = true

func _draw() -> void:
	# Visual cartoon em estilo rubber hose: pedra esférica com contorno grosso e sombreamento
	var radius: float = 8.0
	draw_circle(Vector2.ZERO, radius, Color(0.12, 0.12, 0.12)) # Contorno escuro
	draw_circle(Vector2.ZERO, radius - 1.5, Color(0.55, 0.53, 0.50)) # Corpo rochoso
	draw_circle(Vector2(-2.0, -2.0), 2.5, Color(0.75, 0.73, 0.70)) # Brilho/volume
