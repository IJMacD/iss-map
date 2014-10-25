$(function() {

			/* DOM */
	var canvas = $('#surface'),
			context = canvas[0].getContext("2d"),
			canvasWidth = canvas.width(),
			canvasHeight = canvas.height();
			canvas[0].width = canvasWidth;
			canvas[0].height = canvasHeight,
			canvas2 = $('#composite'),
			context2 = canvas2[0].getContext("2d"),
			canvas2Width = canvas2.width(),
			canvas2Height = canvas2.height();
			canvas2[0].width = canvas2Width;
			canvas2[0].height = canvas2Height,
			moduleToolbox = $('#module-toolbox'),

			/* Data */
			modules = [
				{
					id: "zarya",
					name: "Zarya",
					image: "img/modules/ISS-Zarya.png",
					ports: [
						{
							type: "CBM",
							offsetX: -111,
							offsetY: 0,
							orientation: 3 * Math.PI * 0.5
						},
						{
							type: "CBM",
							offsetX: 106,
							offsetY: 0,
							orientation: 1 * Math.PI * 0.5
						},
						{
							type: "CBM",
							offsetX: 87,
							offsetY: 20,
							orientation: 2 * Math.PI * 0.5
						}
					]
				},
				{
					id: "node1",
					name: "Unity",
					image: "img/modules/ISS-Unity.png",
					ports: [
						{
							type: "CBM",
							offsetX: -49,
							offsetY: 0,
							orientation: 3 * Math.PI * 0.5
						},
						{
							type: "CBM",
							offsetX: 8,
							offsetY: -38,
							orientation: 0 * Math.PI * 0.5
						},
						{
							type: "CBM",
							offsetX: 47,
							offsetY: 0,
							orientation: 1 * Math.PI * 0.5
						},
						{
							type: "CBM",
							offsetX: 8,
							offsetY: 38,
							orientation: 2 * Math.PI * 0.5
						}
					]
				},
				{
					id: "zvezda",
					name: "Zvezda",
					image: "img/modules/ISS-Zvezda.png"
				},
				{
					id: "destiny",
					name: "Destiny",
					image: "img/modules/ISS-Destiny.png"
				},
				{
					id: "quest",
					name: "Joint Airlock",
					image: "img/modules/ISS-Airlock.png"
				},
				{
					id: "pirs",
					name: "Pirs",
					image: "img/modules/ISS-Pirs.png"
				},
				{
					id: "node2",
					name: "Harmony",
					image: "img/modules/ISS-Harmony.png"
				},
				{
					id: "columbus",
					name: "Columbus",
					image: "img/modules/ISS-Columbus.png"
				},
				{
					id: "kibo",
					name: "きぼう (Kibo)",
					image: "img/modules/ISS-Kibo.png"
				}
			],


			/* Parameters */
			placingModule = false,

			openPorts = [];

	modules.forEach(function(item){
		var li = $('<li>'+item.name+'</li>');
		li.data("module", item);
		moduleToolbox.append(li);
	});

	moduleToolbox.on("click", "li", function(e){
		var li = $(this),
				data = li.data("module");
				x = e.pageX - canvas2.offset().left,
				y = e.pageY - canvas2.offset().top;
		placeModule(data, x, y);
	});

	function placeModule(module, x, y){
		placingModule = {x: x, y: y};

		var imageObj = new Image();
		imageObj.onload = function() {
			requestAnimationFrame(drawImage)
		};
		imageObj.src = module.image;
		module.imageObj = imageObj;

		canvas2.on("mousemove", function(e){
			placingModule.x = e.pageX - canvas2.offset().left;
			placingModule.y = e.pageY - canvas2.offset().top;
		});

		canvas2.on("mousedown", function(e){
			var targetPos = placingModule;

			if(e.which == 1){


				// find snap targets
				if(module.ports){
					module.ports.forEach(function(port){
						openPorts.forEach(function(openPort){
							var o = {
								x: targetPos.x + port.offsetX,
								y: targetPos.y + port.offsetY
							}
							if(dist(o, openPort) < 10){
								targetPos.x = openPort.x - port.offsetX;
								targetPos.y = openPort.y - port.offsetY;
								return false;
							}
						});
					});
				}

				// Commit module

				drawModule(context, targetPos, module);

				if(module.ports){
					module.ports.forEach(function(port){
						openPorts.push({
							x: targetPos.x + port.offsetX,
							y: targetPos.y + port.offsetY,
							orientation: port.orientation
						});
					});
				}

				console.log(openPorts);

				// Clean up
				canvas2.off("mousemove mousedown contextmenu");
				canvas2.clearRect(0, 0, canvas2Width, canvas2Height);

				placingModule = null;
			}
			else if(e.which == 3){
				var r = placingModule.rotate || 0;
				placingModule.rotate = (r + Math.PI / 2);
				drawImage();
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		});
		canvas2.on("contextmenu", function(e){
			return false;
		});

		function drawImage(){
			if(placingModule){
				context2.clearRect(0, 0, canvas2Width, canvas2Height);
				drawModule(context2, placingModule, module);
				requestAnimationFrame(drawImage);
			}
		}

		function drawModule(ctx, pos, module){
			ctx.save();
			ctx.translate(pos.x, pos.y)
			if(pos.rotate){
				ctx.rotate(pos.rotate);
			}
			ctx.drawImage(module.imageObj, -module.imageObj.width/2, -module.imageObj.height/2);
			drawPorts(ctx, module);
			ctx.restore();
		}

		function drawPorts(ctx, module){
			if(module.ports){
				module.ports.forEach(function(port){
					var CBM_WIDTH = 20;

					var r = port.orientation,
							demiPortWidth = CBM_WIDTH / 2,
							sinr = Math.sin(r) * demiPortWidth,
							cosr = Math.cos(r) * demiPortWidth,
							x1 = port.offsetX - cosr,
							y1 = port.offsetY - sinr,
							x2 = port.offsetX + cosr,
							y2 = port.offsetY + sinr;

					ctx.lineWidth = 2;
					ctx.strokeStyle = "#FF0000",

					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.stroke();
				});
			}
		}
	}

	function dist(a, b){
		return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
	}
});
