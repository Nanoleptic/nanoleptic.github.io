

function is_touch_device() {  
  try {  
    document.createEvent("TouchEvent");  
    return true;  
  } catch (e) {  
    return false;  
  }  
}

if (is_touch_device()){
  document.addEventListener("touchstart",function(e){  
    makeSplod(e.changedTouches[0].clientX, e.changedTouches[0].clientY, 3)
    e.preventDefault();
  });
} else {
  document.addEventListener("mousedown",function(e){
    makeSplod(e.clientX, e.clientY, 5)
  });
}

(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
})();

window.addEventListener("optimizedResize",function() {
  var cubes = document.getElementsByClassName("cube-holder");
  while (cubes.length>0) {
    document.body.removeChild(cubes[0]);
    cubes = document.getElementsByClassName("cube-holder");
  }
  makeCubes();
})
window.addEventListener("load",function() {
  makeCubes();
  //document.body.style["background-color"] ="rgb("+Math.floor(Math.random()*255)+", "+Math.floor(Math.random()*255)+", "+Math.floor(Math.random()*255)+")";
});


function resetCubes() {
  var cubes = document.getElementsByClassName("cube-holder");
  for (var i = 0; i < cubes.length; i++) {
    resetCube(cubes[i]);
  }
}
function resetCube(cube){
  cube.style.top = cube.dataset.top;
  cube.style.left = cube.dataset.left;
  cube.style.transform = "";
}

function makeCubes() {
  var spacing = window.innerHeight/8;
  var off = ((window.innerWidth-spacing*2)/spacing)%1
  off/=2;
  for (var i = spacing+off*spacing; i < window.innerWidth-spacing; i+=spacing) {
    for (var j = spacing; j < window.innerHeight; j+=spacing) {
      var holder = document.createElement("div");
      holder.classList.add("cube-holder");
      var cube = document.createElement("div");
      cube.classList.add("cube");
      holder.style.top = j+"px";
      holder.style.left = i+"px";
      holder.dataset.top = j+"px";
      holder.dataset.left = i+"px";
      holder.dataset.timeout = 0;
      holder.appendChild(cube);
      document.body.appendChild(holder);
    }
  }
}

function makeSplod(x, y, level){
  var holder = document.createElement("div");
  holder.classList.add("splod-holder");
  var splod = document.createElement("div");
  splod.classList.add("splod"+level);
  holder.style.top = y+"px";
  holder.style.left = x+"px";
  holder.appendChild(splod);
  document.body.appendChild(holder);
  setTimeout(function(){
    //document.body.removeChild(holder);
    holder.classList.remove("splod-holder")
    holder.removeChild(splod);
  },1000);
  setTimeout(function(){
    document.body.removeChild(holder);
  },3000);
  var cubes = document.getElementsByClassName("cube-holder");
  for (var i = 0; i < cubes.length; i++) {
    pushCube(cubes[i], x, y, level*50);
  }
}

function pushCube(cube, x, y, range) {
  var tstring = cube.style.transform;
  var angle = 0;
  posx = 100;
  posy = 100;
  if (cube.style.top.length>0){
    posy = + cube.style.top.match(/[0-9]*/g)[0];
    posx = + cube.style.left.match(/[0-9]*/g)[0];
  }
  var dx = x-posx;
  var dy = y-posy;
  var d = Math.sqrt(dx*dx+dy*dy);
  var impact = range-d;
  
  if (impact>0){
    var imp = impact/range+Math.random()*0.3;
    var nx = dx/d
    var ny = dy/d
    if (tstring.length>0){
      angle = + tstring.match(/[0-9]*/g)[0];
    }
    angle+=(Math.random()*2-1)*60*imp;
    posx-=nx*(range*0.5)*imp*imp;
    posy-=ny*(range*0.5)*imp*imp;
    cube.style.transform = "rotate("+angle+"deg)";
    cube.style.top = posy+"px";
    cube.style.left = posx+"px";
    clearTimeout(cube.dataset.timeout);
    cube.dataset.timeout = setTimeout(function(){
      resetCube(cube);
    },500+Math.random()*1000);
  }
}