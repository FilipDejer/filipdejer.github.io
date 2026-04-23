function getLocation() {
  if (! navigator.geolocation) {
    alert("Sorry, no geolocation available for you!");
  }

  navigator.geolocation.getCurrentPosition((position) => {
    document.getElementById("latitude").innerText = position.coords.latitude;
    document.getElementById("longitude").innerText = position.coords.longitude;
  }, (positionError) => {
    console.error(positionError);
  }, {
    enableHighAccuracy: false
  });
}

let map = L.map('map').setView([53.430127, 14.564802], 18);
// L.tileLayer.provider('OpenStreetMap.DE').addTo(map);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

document.getElementById("saveButton").addEventListener("click", function() {
  leafletImage(map, function (err, canvas) {
    // here we have the canvas
    let rasterMap = document.getElementById("rasterMap");
    let rasterContext = rasterMap.getContext("2d");

    rasterContext.drawImage(canvas, 0, 0, 400, 400);
    divideCanvasIntoPuzzles('rasterMap', 'puzzleContainer');
  });
});
function divideCanvasIntoPuzzles(canvasId, containerId) {
  const originalCanvas = document.getElementById(canvasId);
  const container = document.getElementById(containerId);
  const ctx = originalCanvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, originalCanvas.width, originalCanvas.height);
  const puzzleWidth = originalCanvas.width / 4;
  const puzzleHeight = originalCanvas.height / 4;
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const puzzleCanvas = document.createElement('canvas');
      puzzleCanvas.width = puzzleWidth;
      puzzleCanvas.height = puzzleHeight;
      puzzleCanvas.id = `puzzle-${row}-${col}`; // Dodaj unikatowy id
      puzzleCanvas.classList.add('puzzle-piece');
      puzzleCanvas.draggable = true;
      const puzzleCtx = puzzleCanvas.getContext('2d');
      puzzleCtx.putImageData(
        ctx.getImageData(col * puzzleWidth, row * puzzleHeight, puzzleWidth, puzzleHeight),
        0, 0
      );
      container.appendChild(puzzleCanvas);
    }
  }
  // Dodaj drag and drop dla nowo utworzonych puzzli
  attachDragListeners();
}

function attachDragListeners() {
  let items = document.querySelectorAll('.puzzle-piece');
  for (let item of items) {
    item.addEventListener("dragstart", function(event) {
      this.style.border = "5px dashed #D8D8FF";
      event.dataTransfer.setData("text", this.id);
    });

    item.addEventListener("dragend", function(event) {
      this.style.borderWidth = "0";
    });
  }
}





//drag and drop
let items = document.querySelectorAll('.item');
for (let item of items) {
  item.addEventListener("dragstart", function(event) {
    this.style.border = "5px dashed #D8D8FF";
    event.dataTransfer.setData("text", this.id);
  });

  item.addEventListener("dragend", function(event) {
    this.style.borderWidth = "0";
  });
}

let targets = document.querySelectorAll(".drag-target");
for (let target of targets) {
  target.addEventListener("dragenter", function (event) {
    this.style.border = "2px solid #7FE9D9";
  });
  target.addEventListener("dragleave", function (event) {
    this.style.border = "2px dashed #7f7fe9";
  });
  target.addEventListener("dragover", function (event) {
    event.preventDefault();
  });
  target.addEventListener("drop", function (event) {
    let myElement = document.querySelector("#" + event.dataTransfer.getData('text'));
    this.appendChild(myElement)
    this.style.border = "2px dashed #7f7fe9";
  }, false);
}
