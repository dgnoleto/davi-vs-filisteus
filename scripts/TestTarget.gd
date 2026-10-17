class_name TestTarget
extends StaticBody2D

signal target_impact(stone: Node2D, impact_pos: Vector2, impact_vel: Vector2)

var impact_count: int = 0
var last_impact_pos: Vector2 = Vector2.ZERO
var last_impact_vel: Vector2 = Vector2.ZERO

func _ready() -> void:
	pass

func register_hit(stone: Node2D, impact_pos: Vector2, impact_vel: Vector2) -> void:
	impact_count += 1
	last_impact_pos = impact_pos
	last_impact_vel = impact_vel
	target_impact.emit(stone, impact_pos, impact_vel)
	# Efeito visual de tremor rápido ao ser atingido
	var tween: Tween = create_tween()
	tween.tween_property(self, "position:x", position.x + 4.0, 0.04)
	tween.tween_property(self, "position:x", position.x - 4.0, 0.04)
	tween.tween_property(self, "position:x", position.x, 0.04)

func _draw() -> void:
	# Pilar/poste de alvo em estilo borracha clássica
	var size: Vector2 = Vector2(40.0, 100.0)
	var top_left: Vector2 = Vector2(-size.x * 0.5, -size.y * 0.5)
	
	# Contorno e corpo do poste de madeira
	draw_rect(Rect2(top_left, size), Color(0.12, 0.12, 0.12)) # Borda grossa
	draw_rect(Rect2(top_left + Vector2(2, 2), size - Vector2(4, 4)), Color(0.60, 0.40, 0.25)) # Madeira
	
	# Círculos de alvo / bullseye central
	var center: Vector2 = Vector2(0.0, -10.0)
	draw_circle(center, 18.0, Color(0.12, 0.12, 0.12))
	draw_circle(center, 16.0, Color(0.95, 0.95, 0.95))
	draw_circle(center, 11.0, Color(0.85, 0.20, 0.20))
	draw_circle(center, 5.0, Color(0.95, 0.95, 0.95))
