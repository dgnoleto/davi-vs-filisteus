class_name David
extends CharacterBody2D

## Velocidade de movimentação cinemática do Davi (adaptada para coordenadas 2D do Godot)
@export var speed: float = 300.0

## Multiplicador de força de lançamento (portado do protótipo David.js: LAUNCH_MULTIPLIER = 0.18)
@export var launch_multiplier: float = 0.18

## Raio máximo de puxão do estilingue em pixels (David.js: MAX_PULL_RADIUS = 120)
@export var max_pull_radius: float = 120.0

@onready var sprite: Sprite2D = $Sprite2D
@onready var collision_shape: CollisionShape2D = $CollisionShape2D

func _ready() -> void:
	# Garante que Davi inicie voltado para a direita (em direção aos inimigos)
	# O asset nativo está voltado para a esquerda, portanto flip_h = true o orienta para a direita
	if sprite:
		sprite.flip_h = true

func _physics_process(_delta: float) -> void:
	# Captura o vetor de entrada usando os eixos padrão do Godot (setas / WASD)
	var input_vector: Vector2 = Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	
	# Aplica a velocidade ao vetor de movimento
	velocity = input_vector * speed
	
	# Espelha o sprite horizontalmente conforme a direção da caminhada
	# Quando andando para a direita (input_vector.x > 0), flip_h = true (olhando para a direita)
	# Quando andando para a esquerda (input_vector.x < 0), flip_h = false (olhando para a esquerda)
	if input_vector.x != 0.0 and sprite:
		sprite.flip_h = input_vector.x > 0.0
	
	# Executa a movimentação com física cinemática nativa do Godot 4
	move_and_slide()
