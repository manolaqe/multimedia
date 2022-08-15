/* 
Autor: Mihai-Andrei Manolache
Grupa: 1086
Title: Program de desenare raster folosind elementul canvas
*/

//canvas + context
const mainCanvas = document.getElementById('canvas');
const mainContext = mainCanvas.getContext('2d');

//drop-down pentru instrumente
const instrument = document.getElementById('instrumentSelect');

//color picker pentru instrument
const colorPicker = document.getElementById('colorPicker');

//color picker pentru culoarea de fundal
const backgroundPicker = document.getElementById('backgroundPicker');

//slider pentru grosimea instrumentului
const widthSlider = document.getElementById('widthSlider');

//drop-down cu figurile desenate
const figuri = document.getElementById('figuri');

//link pentru download png
const downloadPNG = document.getElementById('downloadPNG');

//initializare pentru culoarea si grosimea instrumentului
var toolColor = 'rgb(0, 0, 0)';
var toolWidth = 1;

//vector in care sunt salvate obiectele corespunzatoare figurilor desenate
var figuriArray = [];

//tratare eveniment pentru setarea culorii instrumentului in momentul in care valoarea picker-ului se schimba
colorPicker.addEventListener('change', function(e) {
    mainContext.strokeStyle = e.target.value;
    toolColor = e.target.value;
});

//tratare eveniment pentru setarea culorii instrumentului in momentul in care valoarea picker-ului se schimba
backgroundPicker.addEventListener('change', function(e) {
    mainContext.fillStyle = e.target.value;
    clear();
});

//tratare eveniment pentru setarea grosimii instrumentului in momentul in care valoarea slider-ului se schimba
widthSlider.addEventListener('change', function(e) {
    mainContext.lineWidth = e.target.value;
    toolWidth = e.target.value;
})

//setare dimensiuni + culoare fundal pentru canvas pana la interventia utilizatorului
mainCanvas.setAttribute('width', 1000);
mainCanvas.setAttribute('height', 562);
clear();

//coordonatele de pornire pentru figuri
var startX;
var startY;

var isMouseDown = false;

//constructor elipsa
function elipsa() {
    this.x = 0;
    this.y = 0;
    this.radiusX = 0;
    this.radiusY = 0;
    this.color = toolColor;
    this.toolWidth = toolWidth;
    this.draw = function(e) {
        this.radiusX = Math.sqrt((e.clientX - startX) * (e.clientX - startX)) / 2;
        this.radiusY = Math.sqrt((e.clientY - startY) * (e.clientY - startY)) / 2;

        if (startX > e.clientX) {
            this.x = startX - this.radiusX;
            if (startY > e.clientY) {
                this.y = startY - this.radiusY;
            } else if (startY < e.clientY) {
                this.y = startY + this.radiusY;
            }
        } else if (startX < e.clientX) {
            this.x = startX + this.radiusX;
            if (startY > e.clientY) {
                this.y = startY - this.radiusY;
            } else if (startY < e.clientY) {
                this.y = startY + this.radiusY;
            }
        }

        this.drawWithoutEvent();
    }

    this.drawWithoutEvent = function() {
        mainContext.beginPath();
        mainContext.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
        mainContext.strokeStyle = this.color;
        mainContext.lineWidth = this.toolWidth;
        mainContext.stroke();
    }
}

//constructor dreptunghi
function dreptunghi() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.color = toolColor;
    this.toolWidth = toolWidth;
    this.draw = function(e) {
        this.width = Math.sqrt((e.clientX - startX) * (e.clientX - startX));
        this.height = Math.sqrt((e.clientY - startY) * (e.clientY - startY));

        this.x = startX;
        this.y = startY;

        //poate faci ceva sa schimbi top corner
        this.drawWithoutEvent();
    }

    this.drawWithoutEvent = function() {
        mainContext.beginPath();
        mainContext.rect(this.x, this.y, this.width, this.height);
        mainContext.strokeStyle = this.color;
        mainContext.lineWidth = this.toolWidth;
        mainContext.stroke();
    }
}

//constructor linie
function linie() {
    this.x = 0;
    this.y = 0;
    this.endX = 0;
    this.endY = 0;
    this.color = toolColor;
    this.toolWidth = toolWidth;
    this.draw = function(e) {
        this.endX = e.clientX;
        this.endY = e.clientY;

        this.x = startX;
        this.y = startY;

        this.drawWithoutEvent();
    }

    this.drawWithoutEvent = function() {
        mainContext.beginPath();
        mainContext.moveTo(this.x, this.y);
        mainContext.lineTo(this.endX, this.endY);
        mainContext.strokeStyle = this.color;
        mainContext.lineWidth = this.toolWidth;
        mainContext.stroke();
    }
}

//functie care "curata" canvasul de fazele prin care cer figurile (necesar pentru preview)
function clear() {
    mainContext.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
    figuriArray.forEach(element => {
        element.drawWithoutEvent();
    });
};

//tratare eveniment mousedown
mainCanvas.addEventListener('mousedown', function(e) {
    isMouseDown = true;
    startX = e.clientX;
    startY = e.clientY;
});

//tratare eveniment mouseup: redesenam pozitia finala a figurii si o "salvam" in vector
mainCanvas.addEventListener('mouseup', function(e) {
    if (isMouseDown) {
        clear();
        switch (instrument.value) {
            case 'elipsa':
                var elipsaSuport = new elipsa();
                elipsaSuport.draw(e);
                pushFigura(elipsaSuport);
                break;
            case 'dreptunghi':
                var dreptunghiSuport = new dreptunghi();
                dreptunghiSuport.draw(e);
                pushFigura(dreptunghiSuport);
                break;
            case 'linie':
                var linieSuport = new linie();
                linieSuport.draw(e);
                pushFigura(linieSuport);
                break;
        }

    }
    isMouseDown = false;
});

//tratare eveniment mouseout: similar cu mouseup
mainCanvas.addEventListener('mouseout', function(e) {
    if (isMouseDown) {
        clear();
        switch (instrument.value) {
            case 'elipsa':
                var elipsaSuport = new elipsa();
                elipsaSuport.draw(e);
                pushFigura(elipsaSuport);
                break;
            case 'dreptunghi':
                var dreptunghiSuport = new dreptunghi();
                dreptunghiSuport.draw(e);
                pushFigura(dreptunghiSuport);
                break;
            case 'linie':
                var linieSuport = new linie();
                linieSuport.draw(e);
                pushFigura(linieSuport);
                break;
        }

    }
    isMouseDown = false;
});

//tratare eveniment mousemove: redesenare + curatare canvas la fiecare schimbare de coordonate (preview)
mainCanvas.addEventListener('mousemove', function(e) {
    if (isMouseDown) {
        clear();
        switch (instrument.value) {
            case 'elipsa':
                let elipsaSuport = new elipsa();
                elipsaSuport.draw(e);
                break;
            case 'dreptunghi':
                let dreptunghiSuport = new dreptunghi();
                dreptunghiSuport.draw(e);
                break;
            case 'linie':
                let linieSuport = new linie();
                linieSuport.draw(e);
                break;
        }
    }
});

//in momentul in care se sterge o figura, o scoatem din vector, dar si din drop-down
figuri.addEventListener('input', function(e) {
    figuriArray.pop(figuri.value);
    figuri.remove(figuri.selectedIndex);
    clear();
});

//tratare eveniment pentru generarea fisierului in format png
downloadPNG.addEventListener('click', (e) => {
    const dataUrl = mainCanvas.toDataURL('image/svg');
    e.currentTarget.setAttribute('href', dataUrl);
});

//functie pentru adaugarea obiectelor in vector si in drop-down
function pushFigura(o) {
    figuriArray.push(o);

    var option = document.createElement('option');
    option.textContent = o.constructor.name + '-' + o.x + '-' + o.y + '-' + o.toolWidth;
    option.value = o;
    figuri.appendChild(option);

};