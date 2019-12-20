class Paint {
    constructor() {
        this.canvas = document.getElementById('board');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.color = "#000000";
        this.tool = 'pen';//circle rect line
        this.lineWidth = 5;

        this.currentPos = {
            x: 0,
            y: 0
        };

        this.startPos = {
            x: 0,
            y: 0
        }
        this.oldImage = null;
        this.newImage =null;

        this.drawing = false;
        this.drawBackground();

        //listen mouse event
        this.listenMouseEvent();

    }

    getMousePos(evt) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    mousedown(event) {
        this.startPos = this.getMousePos(event);
        this.drawing = true;
        this.oldImage = new Image();
        this.oldImage.src = this.canvas.toDataURL("image/png");
    }
    mousemove(event) {
        let mousePos = this.getMousePos(event);
        if (this.drawing) {
            switch (this.tool) {
                case 'pen':
                    this.drawLine(this.currentPos, mousePos);
                    break;
                case 'line':
                    this.undo();
                    this.drawLine(this.startPos, mousePos);
                    break;
                case 'rect':
                    this.undo();
                    this.drawRect(this.startPos, mousePos);
                    break;
            }
        }
        this.currentPos = mousePos;

    }
    mouseup(event) {
        this.drawing = false;
    }
    listenMouseEvent() {
        this.canvas.addEventListener('mousedown', (event) => this.mousedown(event));
        this.canvas.addEventListener('mousemove', (event) => this.mousemove(event));
        this.canvas.addEventListener('mouseup', (event) => this.mouseup(event));
    }

    undo() {
        this.newImage = new Image();
        this.newImage.src = this.canvas.toDataURL("image/png");
        this.ctx.drawImage(this.oldImage, 0, 0, 800, 500);
        
    }
    redo() {
        
        this.ctx.drawImage(this.newImage, 0, 0, 800, 500);
        
    }

    drawBackground() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, 800, 500);
    }

    drawRect(startPos, endPos) {
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.rect(startPos.x, startPos.y, endPos.x-startPos.x, endPos.y-startPos.y);
        this.ctx.stroke();
    }
    drawLine(startPos, endPos) {
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.moveTo(startPos.x, startPos.y);
        this.ctx.lineTo(endPos.x, endPos.y);
        this.ctx.stroke();
    }
}

var p = new Paint();