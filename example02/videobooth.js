// 影片來源(用json定義)
var videos ={
	video1:"video/demovideo1",
	video2:"video/demovideo2"
};

var effectionFunction = null;

window.onload = function(){
	var video = document.getElementById("video");
	video.src = videos["video1"] + getFormatExtension();
	video.load();

	var videoLinks = document.querySelectorAll("a.videoSelection");
	for (var i = 0; i < videoLinks.length; i++)
		videoLinks[i].onclick = setVideo;

	var controLinks = document.querySelectorAll("a.control");
	for (var i = 0; i < controLinks.length; i++)
		controLinks[i].onclick = handleControl;

	var effectLinks = document.querySelectorAll("a.effect");
	for (var i = 0; i < effectLinks.length; i++)
		effectLinks[i].onclick = setEffect;

	video.addEventListener("play", processFrame, false);
	video.addEventListener("ended", endedHandler, false);
	pushUnpushButtons("video1","[]"); // 未完成


}

//取得影片副檔名
function getFormatExtension(){
	var video = document.getElementById("video");
	if (video.canPlayType("video/mp4") !=="")
		return ".mp4";
	else if (video.canPlayType("video/ogg") !=="")
		return ".ogv";
	else if (video.canPlayType("video/webm") !=="")
		return ".webm";
}


function processFrame(e){
	var video = document.getElementById("video");
	if (video.paused || video.ended) // 暫停或停止時，不處理(return)
		return;

	var bufferCanvas = document.getElementById("buffer");
	var displayCanvas = document.getElementById("display");
	var buffer = bufferCanvas.getContext('2d');
	var display = displayCanvas.getContext('2d');

	buffer.drawImage(video,0,0,bufferCanvas.width, bufferCanvas.height);
	var frame = buffer.getImageData(0,0,bufferCanvas.width, bufferCanvas.height);// 影格
	for (var i = 0; i < frame.data.length/4; i++) {
		var r = frame.data[i*4+0]; // Red
		var g = frame.data[i*4+1]; // Green
		var b = frame.data[i*4+2]; // Blue

		if (effectionFunction){ // 
			effectionFunction(i,r,g,b,from.data);
		}
	};
	display.putImageData(fram,0,0);
	setTimeout(processFrame,0); // again

}

// 特效
function western(pos, i,r,g,b,data){
	var brightness = (3 * r + 4 * g + b) >>> 3;// >>>無符號右移運算子
	data[pos * 4 + 0] = brightness + 40;
	data[pos * 4 + 1] = brightness + 20;
	data[pos * 4 + 2] = brightness - 20;
	data[pos * 4 + 3] = 255; //220;
}

function noir(pos, i,r,g,b,data){
	var brightness = (3 * r + 4 * g + b) >>> 3;// >>>無符號右移運算子
	data[pos * 4 + 0] = brightness;
	data[pos * 4 + 1] = brightness;
	data[pos * 4 + 2] = brightness;
	data[pos * 4 + 3] = 255; //220;
}

function scifi(pos, i,r,g,b,data){
	 var offset = pos * 4;
	 data[offset] = Math.round(255 - r);
	 data[offset + 1] = Math.round(255 - g);
	 data[offset + 2] = Math.round(255 - b);
}


// 
function setVideo(e){
	var id = e.target.getAttribute("id");
	var video = document.getElementById("video");
	if (id==="video1") // 壓下video1時...
		pushUnpushButtons("video1" ,["video2"]); // 修改圖片樣式
	else if (id==="video2") // 壓下video2時...
		pushUnpushButtons("video2" ,["video1"]);

	video.src = videos[id] + getFormatExtension(); // [key] return value
	video.load();
	video.play();
	pushUnpushButtons("play" ,["pause"]); // 修改圖片樣式

}

// view 4 按鈕控制
function handleControl(e){
	var id = e.target.getAttribute("id");
	var video = document.getElementById("video");
	if (id==="play"){
		pushUnpushButtons("play" ,["pause"]);
		if (video.ended){
			video.load();
		}
	}
	else if (id==="pause"){
		pushUnpushButtons("pause" ,["play"]);
		video.pause();
	}
	else if (id==="loop"){
		if (isButtonPushed("loop")){
			pushUnpushButtons("" ,["loop"]);
		}else{
			pushUnpushButtons("loop" ,[""]);
		}
		video.loop = !video.loop;
		
	}
	else if (id==="mute"){
		if (isButtonPushed("mute")){
			pushUnpushButtons("" ,["mute"]);
		}else{
			pushUnpushButtons("mute" ,[""]);
		}
		video.muted = !video.muted;
	}
}

function setEffect(e){
	var id = e.target.getAttribute("id");
	var video = document.getElementById("video");
	if (id==="normal"){
		pushUnpushButtons("normal" ,["western","noir","scifi"]);
		effectionFunction = null;
	}
	else if (id==="western"){
		pushUnpushButtons("western" ,["normal","noir","scifi"]);
		effectionFunction = null;
	}
	else if (id==="noir"){
		pushUnpushButtons("noir" ,["western","normal","scifi"]);
		effectionFunction = null;
		
	}
	else if (id==="scifi"){
		pushUnpushButtons("scifi" ,["western","noir", "normal"]);
		effectionFunction = null;
		
	}
}

function endedHandler(e){
		pushUnpushButtons("" ,["play"]);
}

function isButtonPushed(id){
	var anchor = document.getElementById(id);
	var theClass = document.getAttribute("class");
	return (theClass.indexOf("selected")>=0);

}

