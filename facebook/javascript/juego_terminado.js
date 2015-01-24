var jugar = function() {
				/*---------------------------------------------------------------------*/
				/*----------------------- CONFIGURACION DEL FRAMEWORK -----------------*/

				/* Creamos un objeto con la funcion Quintus, lo guardamos en una variable
				 * llamada Q */
				var Q = Quintus({
					development : true
				});
				/* habilita los modulos para trabajar con colisiones y mapas */
				Q.include("Sprites, Scenes, Input, 2D, Touch");
				/* pinta el juego en la caja con id=juego*/
				Q.setup("juego", {
					maximize : true
				});
				/*habilitamos controles (teclado)*/
				Q.controls();
				/*habilitamos controles touch */
				Q.touch();

				/* -------------------- DEFINICION DEL JUGADOR ---------------------- */
				Q.Sprite.extend("Jugador", {
					init : function(p) {
						this._super(p, {
							asset : "player.png",
							x : 110,
							y : 50,
							jumpSpeed : -380
						});
						this.add('2d, platformerControls');
					},
					step : function(dt) {
						if (Q.inputs['left'] && this.p.direction == 'right') {
							this.p.flip = 'x';
						}
						if (Q.inputs['right'] && this.p.direction == 'left') {
							this.p.flip = false;
						}
					}
				});

				/* -------------------- DEFINICION DEL ENEMIGO ---------------------- */
				Q.Sprite.extend("Enemigo", {
					init : function(p) {
						this._super(p, {
							asset : "enemigo.png",
							x : 800,
							y : 50,
							vx : 200
						});
						this.add('2d, aiBounce');
						//colisiones para matar al enemigo
						this.on("bump.top", function(colision) {
							if (colision.obj.isA("Jugador")) {
								this.destroy();
								Q.stageScene("ganar");
							}
						});
						//colisiones para matar al jugador
						this.on("bump.left, bump.right", function(colision) {
							if (colision.obj.isA("Jugador")) {
								colision.obj.destroy();
								Q.stageScene("gameOver");
							}
						});
					},
					step : function(dt) {
						if (this.p.vx < 0) {
							this.p.flip = false;
						}
						if (this.p.vx >= 0) {
							this.p.flip = 'x';
						}
					}
				});

				/* ------------------- DEFINICION DEL NIVEL 1 (escena) -----------------*/
				Q.scene("nivel1", function(stage) {

					var background = new Q.TileLayer({
						dataAsset : 'level1.tmx',
						layerIndex : 0,
						sheet : 'mosaicos',
						tileW : 70,
						tileH : 70,
						type : Q.SPRITE_NONE
					});
					stage.insert(background);

					var colisiones = new Q.TileLayer({
						dataAsset : 'level1.tmx',
						layerIndex : 1,
						sheet : 'mosaicos',
						tileW : 70,
						tileH : 70
					});
					stage.collisionLayer(colisiones);

					//CREAMOS AL JUGADOR
					var jugador = stage.insert(new Q.Jugador());
					stage.add("viewport").follow(jugador, {
						x : true,
						y : true
					}, {
						minX : 0,
						maxX : background.p.w,
						minY : 0,
						maxY : background.p.h
					});

					//insertamos un enemigo
					stage.insert(new Q.Enemigo());

				});

				/* ------------------- DEFINICION DE LA ESCENA GANAR -----------------*/
				Q.scene("ganar", function(stage) {
					alert("Ganaste");
					MIAPP.publicar(" ganó el juego");
					//se ejecuta la escena 1
					Q.stageScene("nivel1");
				});

				/* ------------------- DEFINICION DE LA ESCENA GANAR -----------------*/
				Q.scene("gameOver", function(stage) {
					alert("Game Over");
					MIAPP.publicar(" perdió el juego");
					//se ejecuta la escena 1
					Q.stageScene("nivel1");
				});

				/*-------------------- CARGAMOS IMAGENES, AUDIO Y MAPAS ------------------*/
				Q.load("tiles_map.png, player.png, enemigo.png, level1.tmx", function() {
					/* CREAMOS UNA HOJA DE MOSAICOS*/
					/* las hojas de mosaicos se usan para rellenar mapas */
					Q.sheet("mosaicos", "tiles_map.png", {
						tilew : 70,
						tileh : 70
					});
					/* Una vez listos todos los recursos, ejecutamos la escena nivel1 */
					Q.stageScene("nivel1");
				});
			};