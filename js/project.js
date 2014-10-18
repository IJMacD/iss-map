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
					image: "img/modules/ISS-Zarya.png"
				},
				{
					id: "node1",
					name: "Unity",
					image: "img/modules/ISS-Unity.png"
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
			placingModule = false;

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
		placeModule(data.image, x, y);
	});

	function placeModule(img, x, y){
		placingModule = {x: x, y: y};

		var imageObj = new Image();
		imageObj.onload = function() {
			requestAnimationFrame(drawImage)
		};
		imageObj.src = img;

		canvas2.on("mousemove", function(e){
			placingModule.x = e.pageX - canvas2.offset().left;
			placingModule.y = e.pageY - canvas2.offset().top;
		});

		canvas2.on("mousedown", function(e){
			if(e.which == 1){
				placingModule = null;
				canvas2.off("mousemove mousedown contextmenu");
				context.drawImage(canvas2[0], 0, 0);
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
				context2.save();
				context2.translate(placingModule.x, placingModule.y)
				if(placingModule.rotate){
					context2.rotate(placingModule.rotate);
				}
				context2.drawImage(imageObj, -imageObj.width/2, -imageObj.height/2);
				context2.restore();
				requestAnimationFrame(drawImage);
			}
		}
	}
});
