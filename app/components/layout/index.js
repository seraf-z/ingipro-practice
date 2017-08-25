// import Marks from '../marks';
// import Viewer from '../viewer';
import './style.css';


class Layout {

    constructor(domNode) {
        this._domNode = domNode;

        this._createLayout();

        // mediator.on('layout:change', this._changeLayout.bind(this));
        // mediator.on('layout:restore', this._restoreLayout.bind(this));
    }

    hide() {
        this._domNode.classList.add('hide');
    }

    show() {
        this._domNode.classList.remove('hide');
    }

    _createLayout () {
        this._BORDER = 2;
        this._MINISIZE = 10;

        const BORDER = this._BORDER;
        const tapes = [];
        this._tapes = tapes;
        const domNode = this._domNode;

        createTapeBackground();
        createTapeBorder();
        createNewTape();

        createCellBackground();
        createCellBorder();
        createNewCell();

        function createTapeBackground () {
            tapes[0] = {};
            tapes[0].elem = domNode;
            tapes[0].elem.id = 0;
            tapes[0].tapesNumber = 0;
            tapes[0].currentTapeId = 0;
            tapes[0].lastTapeId = 0;
            tapes[0].direction = false;
            tapes[0].view = true;
            tapes[0].ratio = tapes[0].elem.offsetWidth / tapes[0].elem.offsetHeight;
            tapes[0].lineCell = BORDER / 2 * tapes[0].elem.offsetHeight / 100;
        }
        function createTapeBorder () {
            for (let i = 1; i < 5; i++) {
                tapes[i] = {};
                tapes[i].elem = document.createElement('div');

                switch (i - 1) {
                    case 0:
                        tapes[i].elem.className = "line top";
                        tapes[i].elem.style.top = -BORDER + "%";
                        tapes[i].elem.style.left = -BORDER / tapes[0].ratio + "%";
                        tapes[i].elem.style.height = BORDER + "%";
                        tapes[i].elem.style.width = 100 + 2 * BORDER / tapes[0].ratio + "%";
                        break;
                    case 1:
                        tapes[i].elem.className = "line left";
                        tapes[i].elem.style.left = -BORDER / tapes[0].ratio + "%";
                        tapes[i].elem.style.width = BORDER / tapes[0].ratio + "%";
                        break;
                    case 2:
                        tapes[i].elem.className = "line bot";
                        tapes[i].elem.style.top = "100%";
                        tapes[i].elem.style.left = -BORDER / tapes[0].ratio + "%";
                        tapes[i].elem.style.height = BORDER + "%";
                        tapes[i].elem.style.width = 100 + 2 * BORDER / tapes[0].ratio + "%";
                        break;
                    case 3:
                        tapes[i].elem.className = "line right";
                        tapes[i].elem.style.left = "100%";
                        tapes[i].elem.style.width = BORDER / tapes[0].ratio + "%";
                        break;
                }

                tapes[i].elem.id = i;
                tapes[i].status = "createTape";
                tapes[i].view = true;

                tapes[0].elem.appendChild(tapes[i].elem);
            }

            tapes[0].tapesNumber = 4;
            tapes[0].lastTapeId = 4;
        }
        function createNewTape () {
            tapes[0].tapesNumber++;
            tapes[0].lastTapeId++;
            const id = tapes[0].lastTapeId;

            tapes[id] = {};
            tapes[id].elem = document.createElement('div');
            tapes[id].elem.className = "tape";
            tapes[id].elem.id = id;
            tapes[id].view = true;
            tapes[0].currentTapeId = id;

            if (id === 5) {
                tapes[id].elem.style.flexBasis = "100%";
                tapes[id].lastFlexBasis = 100;
                tapes[id].elem.style.order = 500;
                tapes[0].elem.appendChild(tapes[id].elem);
            } else {
                tapes[id].elem.style.flexBasis = "0%";
                tapes[id].lastFlexBasis = 0;
            }
        }

        function createCellBackground () {
            const parentId = tapes[0].lastTapeId;

            tapes[parentId][0] = {};
            tapes[parentId][0].elem = document.createElement('div');
            tapes[parentId][0].elem.className = "layoutCell";

            tapes[parentId][0].elem.id = 0;
            tapes[parentId][0].elem.tapeId = parentId;
            tapes[parentId][0].cellsNumber = 0;
            tapes[parentId][0].currentCellId = 0;
            tapes[parentId][0].lastCellId = 0;
            tapes[parentId][0].view = true;

            tapes[parentId].elem.appendChild(tapes[parentId][0].elem);
        }
        function createCellBorder () {
            const parentId = tapes[0].lastTapeId;

            for (let i = 1; i < 5; i++) {
                tapes[parentId][i] = {};
                tapes[parentId][i].elem = document.createElement('div');

                switch (i - 1) {
                    case 0:
                        tapes[parentId][i].elem.className = "cellLine top";
                        tapes[parentId][i].elem.style.top = "0%";
                        tapes[parentId][i].elem.style.left = "0%";
                        tapes[parentId][i].elem.style.height = tapes[0].lineCell + "px";
                        tapes[parentId][i].elem.style.width = "100%";
                        break;
                    case 1:
                        tapes[parentId][i].elem.className = "cellLine left";
                        tapes[parentId][i].elem.style.left = "0%";
                        tapes[parentId][i].elem.style.width = tapes[0].lineCell + "px";
                        break;
                    case 2:
                        tapes[parentId][i].elem.className = "cellLine bot";
                        tapes[parentId][i].elem.style.bottom = "0%";
                        tapes[parentId][i].elem.style.left = "0%";
                        tapes[parentId][i].elem.style.height = tapes[0].lineCell + "px";
                        tapes[parentId][i].elem.style.width = "100%";
                        break;
                    case 3:
                        tapes[parentId][i].elem.className = "cellLine right";
                        tapes[parentId][i].elem.style.right = "0%";
                        tapes[parentId][i].elem.style.width = tapes[0].lineCell + "px";
                        break;
                }
                tapes[parentId][i].elem.id = i;
                tapes[parentId][i].elem.tapeId = parentId;
                tapes[parentId][i].status = "createCell";
                tapes[parentId][i].view = true;

                tapes[parentId][0].elem.appendChild(tapes[parentId][i].elem);
            }

            tapes[parentId][0].cellsNumber = 4;
            tapes[parentId][0].lastCellId = 4;

        }
        function createNewCell () {
            const parentId = tapes[0].currentTapeId;
            tapes[parentId][0].cellsNumber++;
            tapes[parentId][0].lastCellId++;
            const id = tapes[parentId][0].lastCellId;

            tapes[parentId][id] = {};
            tapes[parentId][id].elem = document.createElement('div');
            tapes[parentId][id].elem.className = "cell";
            tapes[parentId][id].elem.id = id;
            tapes[parentId][id].elem.tapeId = parentId;
            tapes[parentId][id].view = true;
            tapes[parentId][0].currentCellId = id;

            if (id === 5) {
                tapes[parentId][id].elem.style.flexBasis = "100%";
                tapes[parentId][id].lastFlexBasis = 100;
                tapes[parentId][id].elem.style.order = 500;
                tapes[parentId][0].elem.appendChild(tapes[parentId][id].elem);
            } else {
                tapes[parentId][id].elem.style.flexBasis = "0%";
                tapes[parentId][id].lastFlexBasis = 0;
            }
        }
    }

    _changeLayout () {
        const tapes = this._tapes;
        const BORDER = this._BORDER;
        const MINSIZETAPE = this._MINISIZE;

        let shift;
        let minSizeTape;
        let minSizeCell;

        let previous = {};
        let next = {};
        let external = {};
        let internal = {};

        function createNewTape () {
            tapes[0].tapesNumber++;
            tapes[0].lastTapeId++;
            const id = tapes[0].lastTapeId;

            tapes[id] = {};
            tapes[id].elem = document.createElement('div');
            tapes[id].elem.className = "tape";
            tapes[id].elem.id = id;
            tapes[id].view = true;
            tapes[0].currentTapeId = id;

            if (id === 5) {
                tapes[id].elem.style.flexBasis = "100%";
                tapes[id].lastFlexBasis = 100;
                tapes[id].elem.style.order = 500;
                tapes[0].elem.appendChild(tapes[id].elem);
            } else {
                tapes[id].elem.style.flexBasis = "0%";
                tapes[id].lastFlexBasis = 0;
            }
        }

        function createCellBackground () {
            const parentId = tapes[0].lastTapeId;

            tapes[parentId][0] = {};
            tapes[parentId][0].elem = document.createElement('div');
            tapes[parentId][0].elem.className = "layoutCell";

            tapes[parentId][0].elem.id = 0;
            tapes[parentId][0].elem.tapeId = parentId;
            tapes[parentId][0].cellsNumber = 0;
            tapes[parentId][0].currentCellId = 0;
            tapes[parentId][0].lastCellId = 0;
            tapes[parentId][0].view = true;

            tapes[parentId].elem.appendChild(tapes[parentId][0].elem);
        }
        function createCellBorder () {
            const parentId = tapes[0].lastTapeId;

            for (let i = 1; i < 5; i++) {
                tapes[parentId][i] = {};
                tapes[parentId][i].elem = document.createElement('div');

                switch (i - 1) {
                    case 0:
                        tapes[parentId][i].elem.className = "cellLine top";
                        tapes[parentId][i].elem.style.top = "0%";
                        tapes[parentId][i].elem.style.left = "0%";
                        tapes[parentId][i].elem.style.height = tapes[0].lineCell + "px";
                        tapes[parentId][i].elem.style.width = "100%";
                        break;
                    case 1:
                        tapes[parentId][i].elem.className = "cellLine left";
                        tapes[parentId][i].elem.style.left = "0%";
                        tapes[parentId][i].elem.style.width = tapes[0].lineCell + "px";
                        break;
                    case 2:
                        tapes[parentId][i].elem.className = "cellLine bot";
                        tapes[parentId][i].elem.style.bottom = "0%";
                        tapes[parentId][i].elem.style.left = "0%";
                        tapes[parentId][i].elem.style.height = tapes[0].lineCell + "px";
                        tapes[parentId][i].elem.style.width = "100%";
                        break;
                    case 3:
                        tapes[parentId][i].elem.className = "cellLine right";
                        tapes[parentId][i].elem.style.right = "0%";
                        tapes[parentId][i].elem.style.width = tapes[0].lineCell + "px";
                        break;
                }
                tapes[parentId][i].elem.id = i;
                tapes[parentId][i].elem.tapeId = parentId;
                tapes[parentId][i].status = "createCell";
                tapes[parentId][i].view = true;

                tapes[parentId][0].elem.appendChild(tapes[parentId][i].elem);
            }

            tapes[parentId][0].cellsNumber = 4;
            tapes[parentId][0].lastCellId = 4;

        }
        function createNewCell () {
            const parentId = tapes[0].currentTapeId;
            tapes[parentId][0].cellsNumber++;
            tapes[parentId][0].lastCellId++;
            const id = tapes[parentId][0].lastCellId;

            tapes[parentId][id] = {};
            tapes[parentId][id].elem = document.createElement('div');
            tapes[parentId][id].elem.className = "cell";
            tapes[parentId][id].elem.id = id;
            tapes[parentId][id].elem.tapeId = parentId;
            tapes[parentId][0].currentCellId = id;
            tapes[parentId][id].view = true;

            if (id === 5) {
                tapes[parentId][id].elem.style.flexBasis = "100%";
                tapes[parentId][id].lastFlexBasis = 100;
                tapes[parentId][id].elem.style.order = 500;
                tapes[parentId][0].elem.appendChild(tapes[parentId][id].elem);
            } else {
                tapes[parentId][id].elem.style.flexBasis = "0%";
                tapes[parentId][id].lastFlexBasis = 0;
            }
        }

        function onMouseDown (e) {
            if (e.which !== 1) return;

            let line = {};

            line.elem = e.target.closest(".line");
            if (!line.elem) {
                line.elem = e.target.closest(".internalLine");
            }
            if (line.elem) {
                line = tapes[line.elem.id];
            } else {
                line.elem = e.target.closest(".cellLine");
                if (!line.elem) {
                    line.elem = e.target.closest(".internalCellLine");
                }
                if (line.elem) {
                    line = tapes[line.elem.tapeId][line.elem.id];
                } else {
                    return
                }
            }

            switch (line.status) {
                case "createTape":
                    external = line;
                    if (!tapes[0].direction) {
                        setTapesDirection();
                        setCellsDirection ();
                        closeStatusExternal();
                    }

                    document.onmousemove = throttle(onMouseTapes, 10);
                    document.onmouseup = onMouseUp;
                    break;
                case "resizeTape":
                    internal = line;
                    internal.lineShift = takeCoordinate(e);

                    resizeTape ();

                    document.onmousemove = throttle(onMouseTapes,10);
                    document.onmouseup = onMouseUp;
                    break;
                case "createCell":
                    external = line;
                    tapes[0].currentTapeId = external.elem.tapeId;
                    if (!tapes[0].direction) {
                        setAllDirection();
                        closeStatusExternal();
                    }

                    document.onmousemove = throttle(onMouseCells,10);
                    document.onmouseup = onMouseUp;
                    break;
                case "resizeCell":
                    internal = line;
                    tapes[0].currentTapeId = internal.elem.tapeId;
                    internal.lineShift = takeCoordinateCell(e);

                    resizeCell ();

                    document.onmousemove = throttle(onMouseCells,10);
                    document.onmouseup = onMouseUp;
                    break;
            }
            return false;
        }

        function setAllDirection () {
            const parentId = tapes[0].currentTapeId;
            const cellId = tapes[parentId][0].currentCellId;

            switch (external.elem.className) {
                case "cellLine left":
                case "cellLine right":
                    tapes[1].nextId = tapes[parentId].elem.id;
                    tapes[3].previousId = tapes[parentId].elem.id;

                    tapes[parentId].nextId = tapes[3].elem.id;
                    tapes[parentId].previousId = tapes[1].elem.id;

                    tapes[0].elem.style.flexDirection = "column";
                    minSizeTape = MINSIZETAPE;

                    tapes[parentId][2].nextId = tapes[parentId][cellId].elem.id;
                    tapes[parentId][4].previousId = tapes[parentId][cellId].elem.id;

                    tapes[parentId][cellId].nextId = tapes[parentId][4].elem.id;
                    tapes[parentId][cellId].previousId = tapes[parentId][2].elem.id;

                    tapes[parentId][0].elem.style.flexDirection = "row";
                    minSizeCell = MINSIZETAPE / tapes[0].ratio / 2;
                    break;
                default:
                    tapes[2].nextId = tapes[parentId].elem.id;
                    tapes[4].previousId = tapes[parentId].elem.id;

                    tapes[parentId].nextId = tapes[4].elem.id;
                    tapes[parentId].previousId = tapes[2].elem.id;

                    tapes[0].elem.style.flexDirection = "row";
                    minSizeTape = MINSIZETAPE / tapes[0].ratio;

                    tapes[parentId][1].nextId = tapes[parentId][cellId].elem.id;
                    tapes[parentId][3].previousId = tapes[parentId][cellId].elem.id;

                    tapes[parentId][cellId].nextId = tapes[parentId][3].elem.id;
                    tapes[parentId][cellId].previousId = tapes[parentId][1].elem.id;

                    tapes[parentId][0].elem.style.flexDirection = "column";
                    minSizeCell = MINSIZETAPE / 2;
            }
        }
        function setTapesDirection () {
            const parentId = tapes[0].currentTapeId;

            switch (external.elem.className) {
                case "line top":
                case "line bot":
                    tapes[1].nextId = tapes[parentId].elem.id;
                    tapes[3].previousId = tapes[parentId].elem.id;

                    tapes[parentId].nextId = tapes[3].elem.id;
                    tapes[parentId].previousId = tapes[1].elem.id;

                    tapes[0].elem.style.flexDirection = "column";
                    minSizeTape = MINSIZETAPE;
                    break;
                default:
                    tapes[2].nextId = tapes[parentId].elem.id;
                    tapes[4].previousId = tapes[parentId].elem.id;

                    tapes[parentId].nextId = tapes[4].elem.id;
                    tapes[parentId].previousId = tapes[2].elem.id;

                    tapes[0].elem.style.flexDirection = "row";
                    minSizeTape = MINSIZETAPE / tapes[0].ratio;
            }
        }
        function setCellsDirection () {
            const parentId = tapes[0].currentTapeId;
            const cellId = tapes[parentId][0].currentCellId;

            switch (tapes[0].elem.style.flexDirection) {
                case "column":
                    tapes[parentId][2].nextId = tapes[parentId][cellId].elem.id;
                    tapes[parentId][4].previousId = tapes[parentId][cellId].elem.id;

                    tapes[parentId][cellId].nextId = tapes[parentId][4].elem.id;
                    tapes[parentId][cellId].previousId = tapes[parentId][2].elem.id;

                    tapes[parentId][0].elem.style.flexDirection = "row";
                    minSizeCell = MINSIZETAPE / tapes[0].ratio / 2;
                    break;
                default:
                    tapes[parentId][1].nextId = tapes[parentId][cellId].elem.id;
                    tapes[parentId][3].previousId = tapes[parentId][cellId].elem.id;

                    tapes[parentId][cellId].nextId = tapes[parentId][3].elem.id;
                    tapes[parentId][cellId].previousId = tapes[parentId][1].elem.id;

                    tapes[parentId][0].elem.style.flexDirection = "column";
                    minSizeCell = MINSIZETAPE / 2;
            }
        }
        function closeStatusExternal () {
            let cellId, tapeId, parentId;

            if (external.status === "createTape") {
                tapeId = parseInt(external.elem.id);
                cellId = (parseInt(tapeId) + 1) % 4;
                parentId = tapes[0].currentTapeId;
            } else {
                cellId = external.elem.id;
                tapeId = (parseInt(cellId) + 1) % 4;
                parentId = external.elem.tapeId;
            }

            for (let i = 1; i < 5; i++) {
                if (tapeId % 2 !== i % 2) {
                    tapes[i].status = "close";
                }
                if (cellId % 2 !== i % 2) {
                    tapes[parentId][i].status = "close";
                }
            }
        }

        function createTape () {
            tapes[0].ratio = tapes[0].elem.offsetWidth / tapes[0].elem.offsetHeight;
            tapes[0].lineCell = BORDER / 2 * tapes[0].elem.offsetHeight / 100;
            createInternalTapeLine ();
            createNewTape();

            createCellBackground();
            createCellBorder();
            createNewCell();
            setCellsDirection ();
            closeStatusExternal();

            editConnections ();
        }
        function createCell () {
            createInternalCellLine ();
            createNewCell ();

            editConnections ();
        }

        function createInternalTapeLine () {
            tapes[0].tapesNumber++;
            tapes[0].lastTapeId++;
            const id = tapes[0].lastTapeId;

            tapes[id] = {};
            tapes[id].elem = document.createElement('div');
            tapes[id].elem.className = "internalLine";
            tapes[id].status = "resizeTape";
            tapes[id].elem.id = id;
            tapes[id].view = true;
            if (tapes[0].elem.style.flexDirection === "column") {
                tapes[id].elem.style.flexBasis = BORDER + "%";
                tapes[id].lastFlexBasis = BORDER;
                shift = BORDER / 2;
            } else {
                tapes[id].elem.style.flexBasis = BORDER / tapes[0].ratio + "%";
                tapes[id].lastFlexBasis = BORDER / tapes[0].ratio;
                shift = BORDER / tapes[0].ratio / 2;
            }

            internal = tapes[id];
        }
        function createInternalCellLine () {
            const parentId = tapes[0].currentTapeId;
            tapes[parentId][0].cellsNumber++;
            tapes[parentId][0].lastCellId++;
            const id = tapes[parentId][0].lastCellId;

            tapes[parentId][id] = {};
            tapes[parentId][id].elem = document.createElement('div');

            tapes[parentId][id].elem.className = "internalCellLine";
            tapes[parentId][id].status = "resizeCell";
            tapes[parentId][id].elem.id = id;
            tapes[parentId][id].elem.tapeId = parentId;
            tapes[parentId][id].view = true;
            if (tapes[parentId][0].elem.style.flexDirection === "column") {
                tapes[parentId][id].elem.style.flexBasis = tapes[0].lineCell + "px";
                tapes[parentId][id].lastFlexBasis = tapes[0].lineCell / tapes[parentId][0].elem.offsetHeight * 100;
                shift = BORDER / 4;
            } else {
                tapes[parentId][id].elem.style.flexBasis = tapes[0].lineCell + "px";
                tapes[parentId][id].lastFlexBasis = tapes[0].lineCell / tapes[parentId][0].elem.offsetWidth * 100;
                shift = BORDER / tapes[0].ratio / 4;
            }

            internal = tapes[parentId][id];
        }

        function editConnections () {
            const parentId = tapes[0].currentTapeId;
            const id = tapes[parentId][0].lastCellId;

            switch (external.elem.className) {
                case "line top":
                case "line left":
                case "cellLine top":
                case "cellLine left":
                    if (external.status === "createTape") {
                        next = tapes[external.nextId];
                        previous = tapes[parentId];
                    } else {
                        next = tapes[parentId][external.nextId];
                        previous = tapes[parentId][id];
                    }

                    internal.lineShift = 0;

                    internal.elem.style.order = next.elem.style.order - 1;
                    previous.elem.style.order = internal.elem.style.order - 1;

                    previous.nextId = internal.elem.id;
                    previous.previousId = external.elem.id;

                    next.previousId = internal.elem.id;
                    external.nextId = previous.elem.id;

                    internal.nextId = next.elem.id;
                    internal.previousId = previous.elem.id;
                    break;
                default:
                    if (external.status === "createTape") {
                        previous = tapes[external.previousId];
                        next = tapes[parentId];
                    } else {
                        previous = tapes[parentId][external.previousId];
                        next = tapes[parentId][id];
                    }

                    internal.lineShift = 100;

                    internal.elem.style.order = previous.elem.style.order + 1;
                    next.elem.style.order = internal.elem.style.order + 1;

                    next.nextId = external.elem.id;
                    next.previousId = internal.elem.id;

                    previous.nextId = internal.elem.id;
                    external.previousId = next.elem.id;

                    internal.nextId = next.elem.id;
                    internal.previousId = previous.elem.id;
            }

            if (external.status === "createTape") {
                tapes[0].elem.appendChild(internal.elem);
                tapes[0].elem.appendChild(tapes[parentId].elem);
            } else {
                tapes[parentId][0].elem.appendChild(internal.elem);
                tapes[parentId][0].elem.appendChild(tapes[parentId][id].elem);
            }
        }

        function resizeTape () {
            next = tapes[internal.nextId];
            previous = tapes[internal.previousId];
            shift = 0;
        }
        function resizeCell () {
            const parentId = tapes[0].currentTapeId;

            next = tapes[parentId][internal.nextId];
            previous = tapes[parentId][internal.previousId];
            shift = 0;

        }

        function onMouseTapes(e) {

            let coordinate = takeCoordinate (e);

            if (!isEmpty(external)) {
                if (coordinate < minSizeTape || coordinate > 100 - minSizeTape) {
                    return false;
                }
                createTape ();
                tapes[0].direction = true;
                external = {};
            }

            if (!internal) return false; // элемент не зажат

            coordinate = checkBorder(coordinate);

            setNewSizes (coordinate);

            if (parseFloat(next.elem.style.flexBasis) < minSizeTape / 2) {
                deleteNext (e);
                return false;
            }

            if (parseFloat(previous.elem.style.flexBasis) < minSizeTape / 2) {
                deletePrevious (e);
                return false;
            }

            return false;
        }
        function onMouseCells(e) {

            let coordinate = takeCoordinateCell (e);

            if (!isEmpty(external)) {
                if (coordinate < minSizeCell || coordinate > 100 - minSizeCell) {
                    return false;
                }
                createCell ();
                tapes[0].direction = true;
                external = {};
            }

            if (!internal) return false; // элемент не зажат

            coordinate = checkBorder(coordinate);

            setNewSizes (coordinate);

            if (parseFloat(next.elem.style.flexBasis) < minSizeCell / 2) {
                deleteNextCell (e);
                return false;
            }

            if (parseFloat(previous.elem.style.flexBasis) < minSizeCell / 2) {
                deletePreviousCell (e);
                return false;
            }

            return false;
        }

        function takeCoordinate (e) {
            if (tapes[0].elem.style.flexDirection === "column") {
                return (e.pageY - tapes[0].elem.offsetTop) / tapes[0].elem.offsetHeight * 100;
            }
            return (e.pageX - tapes[0].elem.offsetLeft) / tapes[0].elem.offsetWidth * 100;
        }
        function takeCoordinateCell (e) {
            const parentId = tapes[0].currentTapeId;

            if (tapes[parentId][0].elem.style.flexDirection === "column") {
                return (e.pageY - (tapes[parentId][0].elem.offsetTop + tapes[0].elem.offsetTop)) / tapes[parentId][0].elem.offsetHeight * 100;
            }
            return (e.pageX - (tapes[parentId][0].elem.offsetLeft + tapes[0].elem.offsetLeft)) / tapes[parentId][0].elem.offsetWidth * 100;
        }

        function isEmpty(obj) {
            for (let key in obj) {
                return false;
            }
            return true;
        }
        function checkBorder(coordinate) {
            if (coordinate < 0) {
                return 0;
            }
            if (coordinate > 100) {
                return 100;
            }
            return coordinate;
        }
        function setNewSizes (coordinate) {
            const delta = coordinate - internal.lineShift;

            previous.elem.style.flexBasis = previous.lastFlexBasis + delta - shift + "%";
            next.elem.style.flexBasis = next.lastFlexBasis - delta - shift + "%";
        }

        function deleteNext (e) {

            const shiftNext = parseFloat(next.elem.style.flexBasis) + internal.lastFlexBasis;

            if (!tapes[next.nextId].nextId) {
                deleteBorderNextTape (shiftNext);
                tapes[0].tapesNumber-=2;
            } else {
                deleteCenterNextTape ();
                tapes[0].tapesNumber-=2;
                next.lastFlexBasis = parseFloat(next.elem.style.flexBasis) + shiftNext;
                previous.lastFlexBasis = parseFloat(previous.elem.style.flexBasis);

                internal.lineShift = takeCoordinate(e);
                shift = 0;

                next.elem.style.flexBasis = next.lastFlexBasis + "%";
                previous.elem.style.flexBasis = previous.lastFlexBasis + "%";
            }
            return false;
        }
        function deleteNextCell (e) {

            const parentId = tapes[0].currentTapeId;
            const shiftNext = parseFloat(next.elem.style.flexBasis) + internal.lastFlexBasis;

            if (!tapes[parentId][next.nextId].nextId) {
                deleteBorderNextCell (shiftNext);
                tapes[parentId][0].cellsNumber-=2;
            } else {
                deleteCenterNextCell ();
                tapes[parentId][0].cellsNumber-=2;

                next.lastFlexBasis = parseFloat(next.elem.style.flexBasis) + shiftNext;
                previous.lastFlexBasis = parseFloat(previous.elem.style.flexBasis);

                internal.lineShift = takeCoordinateCell(e);
                shift = 0;

                next.elem.style.flexBasis = next.lastFlexBasis + "%";
                previous.elem.style.flexBasis = previous.lastFlexBasis + "%";
            }
            return false;
        }
        function deleteBorderNextTape (shiftNext) {
            previous.nextId = next.nextId;
            tapes[next.nextId].previousId = previous.elem.id;
            previous.elem.style.flexBasis = parseFloat(previous.elem.style.flexBasis) + shiftNext + "%";

            tapes[0].elem.removeChild(tapes[internal.elem.id].elem);
            tapes[internal.elem.id].view = false;
            tapes[0].elem.removeChild(tapes[next.elem.id].elem);
            tapes[next.elem.id].view = false;
            tapes[0].currentTapeId = previous.elem.id;
            document.onmousemove = null;
        }
        function deleteBorderNextCell (shiftNext) {
            const parentId = tapes[0].currentTapeId;
            previous.nextId = next.nextId;
            tapes[parentId][next.nextId].previousId = previous.elem.id;
            previous.elem.style.flexBasis = parseFloat(previous.elem.style.flexBasis) + shiftNext + "%";

            tapes[parentId][0].elem.removeChild(tapes[parentId][internal.elem.id].elem);
            tapes[parentId][internal.elem.id].view = false;
            tapes[parentId][0].elem.removeChild(tapes[parentId][next.elem.id].elem);
            tapes[parentId][next.elem.id].view = false;
            tapes[parentId][0].currentCellId = previous.elem.id;
            document.onmousemove = null;
        }
        function deleteCenterNextTape () {
            internal.nextId = tapes[next.nextId].nextId;
            tapes[internal.nextId].previousId = internal.elem.id;

            tapes[0].elem.removeChild(tapes[next.nextId].elem);
            tapes[next.nextId].view = false;
            tapes[0].elem.removeChild(tapes[next.elem.id].elem);
            tapes[next.elem.id].view = false;
            next = tapes[internal.nextId];
        }
        function deleteCenterNextCell () {
            const parentId = tapes[0].currentTapeId;
            internal.nextId = tapes[parentId][next.nextId].nextId;
            tapes[parentId][internal.nextId].previousId = internal.elem.id;

            tapes[parentId][0].elem.removeChild(tapes[parentId][next.nextId].elem);
            tapes[parentId][next.nextId].view = false;
            tapes[parentId][0].elem.removeChild(tapes[parentId][next.elem.id].elem);
            tapes[parentId][next.elem.id].view = false;
            next = tapes[parentId][internal.nextId];
        }

        function deletePrevious (e) {

            const shiftPrevious = parseFloat(previous.elem.style.flexBasis) + internal.lastFlexBasis;

            if (!tapes[previous.previousId].previousId) {
                deleteBorderPreviousTape (shiftPrevious);
                tapes[0].tapesNumber-=2;
            } else {
                deleteCenterPreviousTape ();
                tapes[0].tapesNumber-=2;
                next.lastFlexBasis = parseFloat(next.elem.style.flexBasis);
                previous.lastFlexBasis = parseFloat(previous.elem.style.flexBasis) + shiftPrevious;

                internal.lineShift = takeCoordinate(e);
                shift = 0;

                next.elem.style.flexBasis = next.lastFlexBasis + "%";
                previous.elem.style.flexBasis = previous.lastFlexBasis + "%";
            }
            return false;
        }
        function deletePreviousCell (e) {

            const parentId = tapes[0].currentTapeId;
            const shiftPrevious = parseFloat(previous.elem.style.flexBasis) + internal.lastFlexBasis;

            if (!tapes[parentId][previous.previousId].previousId) {
                deleteBorderPreviousCell (shiftPrevious);
                tapes[parentId][0].cellsNumber-=2;
            } else {
                deleteCenterPreviousCell ();
                tapes[parentId][0].cellsNumber-=2;

                next.lastFlexBasis = parseFloat(next.elem.style.flexBasis);
                previous.lastFlexBasis = parseFloat(previous.elem.style.flexBasis) + shiftPrevious;

                internal.lineShift = takeCoordinateCell(e);
                shift = 0;

                next.elem.style.flexBasis = next.lastFlexBasis + "%";
                previous.elem.style.flexBasis = previous.lastFlexBasis + "%";
            }
            return false;
        }
        function deleteBorderPreviousTape (shiftPrevious) {
            next.previousId = previous.previousId;
            tapes[previous.previousId].nextId = next.elem.id;
            next.elem.style.flexBasis = parseFloat(next.elem.style.flexBasis) + shiftPrevious + "%";

            tapes[0].elem.removeChild(tapes[internal.elem.id].elem);
            tapes[internal.elem.id].view = false;
            tapes[0].elem.removeChild(tapes[previous.elem.id].elem);
            tapes[previous.elem.id].view = false;
            tapes[0].currentTapeId = next.elem.id;
            document.onmousemove = null;
        }
        function deleteBorderPreviousCell (shiftPrevious) {
            const parentId = tapes[0].currentTapeId;
            next.previousId = previous.previousId;
            tapes[parentId][previous.previousId].nextId = next.elem.id;
            next.elem.style.flexBasis = parseFloat(next.elem.style.flexBasis) + shiftPrevious + "%";

            tapes[parentId][0].elem.removeChild(tapes[parentId][internal.elem.id].elem);
            tapes[parentId][internal.elem.id].view = false;
            tapes[parentId][0].elem.removeChild(tapes[parentId][previous.elem.id].elem);
            tapes[parentId][previous.elem.id].view = false;
            tapes[parentId][0].currentCellId = next.elem.id;
            document.onmousemove = null;
        }
        function deleteCenterPreviousTape () {
            internal.previousId = tapes[previous.previousId].previousId;
            tapes[internal.previousId].nextId = internal.elem.id;

            tapes[0].elem.removeChild(tapes[previous.previousId].elem);
            tapes[previous.previousId].view = false;
            tapes[0].elem.removeChild(tapes[previous.elem.id].elem);
            tapes[previous.elem.id].view = false;
            previous = tapes[internal.previousId];
        }
        function deleteCenterPreviousCell () {
            const parentId = tapes[0].currentTapeId;
            internal.previousId = tapes[parentId][previous.previousId].previousId;
            tapes[parentId][internal.previousId].nextId = internal.elem.id;

            tapes[parentId][0].elem.removeChild(tapes[parentId][previous.previousId].elem);
            tapes[parentId][previous.previousId].view = false;
            tapes[parentId][0].elem.removeChild(tapes[parentId][previous.elem.id].elem);
            tapes[parentId][previous.elem.id].view = false;

            previous = tapes[parentId][internal.previousId];
        }

        function onMouseUp () {

            if (tapes[0].tapesNumber === 5) {
                const parentId = tapes[0].currentTapeId;
                if (tapes[parentId][0].cellsNumber === 5) {
                    resetDirection ();
                }
            }
            next.lastFlexBasis = parseFloat(next.elem.style.flexBasis);
            previous.lastFlexBasis = parseFloat(previous.elem.style.flexBasis);

            next = {};
            previous = {};
            external = {};
            internal = {};

            document.onmousemove = null;
            document.onmouseup = null;
        }

        function resetDirection () {
            const parentId = tapes[0].currentTapeId;
            for (let i = 1; i < 5; i++) {
                tapes[i].status = "createTape";
                tapes[parentId][i].status = "createCell";
            }

            tapes[0].direction = false;
        }


        document.ondragstart = function() {
            return false;
        }

        // window.onresize = throttle(this.onResize.bind(this), 300);

        document.onmousedown = onMouseDown;

        // function onResize() {
        // }

        function throttle(func, ms) {

            let isThrottled = false,
                savedArgs,
                savedThis;

            function wrapper() {

                if (isThrottled) {
                    savedArgs = arguments;
                    savedThis = this;
                    return;
                }

                func.apply(this, arguments);

                isThrottled = true;

                setTimeout(function() {
                    isThrottled = false;
                    if (savedArgs) {
                        wrapper.apply(savedThis, savedArgs);
                        savedArgs = savedThis = null;
                    }
                }, ms);
            }

            return wrapper;
        }
    }

    // _restoreLayout() {
    //     const tapes = this._tapes;
    //
    //     document.body.appendChild(tapes[0].elem);
    //
    //     for (let i = 1; i < tapes[0].lastTapeId; i++) {
    //         if (tapes[i].view) {
    //             tapes[0].elem.appendChild(tapes[i].elem);
    //             tapes[i].elem.appendChild(tapes[i][0].elem);
    //
    //             for (let j = 1; i < tapes[i][0].lastCellId; j++) {
    //                 if (tapes[i][j].view) {
    //                     tapes[i][0].elem.appendChild(tapes[i][j].elem);
    //                 }
    //             }
    //         }
    //     }
    //
    // }
}

export default Layout;
