export default class Game {
    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200
    };
    score = 0;
    lines = 0;
    playfield = this.createPlayfield(); // Создаем игровое поле
    activePiece = this.createPiece();// Активная фигура
    nextPiece = this.createPiece();

    get level(){
        return Math.floor(this.lines * 0.1);
    };

    getState(){
        const playfield = this.createPlayfield();
        const {y: pieceY, x: pieceX, blocks} = this.activePiece;

        for (let y = 0; y < this.playfield.length; y++) {
            playfield[y] = [];

            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x];
            } 
        }
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if(blocks[y][x]){
                    playfield[pieceY +y][pieceX + x] = blocks[y][x];
                }

                
            }
            
        }
        return { playfield };

    }

    createPlayfield(){
        const playfield = [];

        for (let y = 0; y < 20; y++) {
            playfield[y] = [];

            for (let x = 0; x < 10; x++) {
                playfield[y][x] = 0;
                
            } 
        }
        return playfield;
    }

    createPiece(){
        const index = Math.floor(Math.random() * 7);
        const type = 'IJLOSTZ'[index];
        const piece = { };
        
        switch(type){
            case 'I':
                piece.blocks=[
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ];
                break;
            case 'J':
                piece.blocks = [
                    [0,0,0],
                    [2,2,2],
                    [0,0,0]
                ];
                break;
            case 'L':
                piece.blocks = [
                    [0,0,0],
                    [3,3,3],
                    [0,0,0]
                ];
                break;
            case 'O':
                piece.blocks=[
                    [0,0,0,0],
                    [0,4,4,0],
                    [0,4,4,0],
                    [0,0,0,0]
                ];
                break;
            case 'S':
                piece.blocks = [
                    [0,0,0],
                    [0,5,5],
                    [5,5,0]
                ];
                break;
            case 'T':
                piece.blocks = [
                    [0,0,0],
                    [6,6,6],
                    [0,6,0]
                ];
                break;
            case 'Z':
                piece.blocks = [
                    [0,0,0],
                    [7,7,0],
                    [0,7,7]
                ];
                break;
            default:
                throw new Error('Неизвестный тип фигуры');
        }
        piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
        piece.y = -1;

        return piece;
    };

    movePieceLeft() { //Движение фигуры влево
        this.activePiece.x -= 1;

        if (this.hasCollision()) { //Если вышли за левую границу поля возвращаем х на одну позицию
            this.activePiece.x += 1
        }
    }
    movePieceRight() { //Движение фигуры вправо
        this.activePiece.x += 1;

        if (this.hasCollision()) { //Если вышли за правую границу поля отнимаем от х единицу
            this.activePiece.x -= 1;
        }
    }
    movePieceDown() { //Движение фигуры вниз
        this.activePiece.y += 1;

        if (this.hasCollision()) { // Если вышли за нижнюю границу поля отнимаем от у единицу
            this.activePiece.y -= 1;
            this.lockPiece();// Если встретили другую фигуру или нижнюю границу поля, то фиксируем фигуру на этом месте
            const clearedLines = this.clearLines();
            this.updateScore(clearedLines);
            this.updatePieces(); 
        }
    }

    rotatatePiece() { // Метод поворота фигуры
        this.rotatateBlocks();


        if (this.hasCollision()) {
            this.rotatateBlocks(false);
        };
    }

    rotatateBlocks(clockwise = true) {
        const blocks = this.activePiece.blocks;
        const length = blocks.length;
        const x = Math.floor(length / 2);
        const y = length - 1;

        for (let i = 0; i < x; i++) { // Алгоритм ротации фигуры https://harddrop.com/wiki/SRS
            for (let j = i; j < y - i; j++) {
                const temp = blocks[i][j];

                if (clockwise) {
                    blocks[i][j] = blocks[y - j][i];
                    blocks[y - j][i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[j][y - i];
                    blocks[j][y - i] = temp;
                } else {
                    blocks[i][j] = blocks[j][y - i];
                    blocks[j][y - i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[y - j][i];
                    blocks[y - j][i] = temp;
                }
            }
        };
    }

    hasCollision() { //Метод проверяющий выход за пределы поля
        const {y: pieceY, x: pieceX, blocks} = this.activePiece; // Деструктуризация активной фигуры
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {

                if (
                    blocks[y][x] &&
                    ((this.playfield[pieceY + y] === undefined || this.playfield[pieceY + y][pieceX + x] === undefined) ||
                        this.playfield[pieceY + y][pieceX + x])
                ) {
                    return true;
                };
            };
        };
        return false;
    };

    lockPiece() { // Метод, фиксирующий фигру

        const {
            y: pieceY,
            x: pieceX,
            blocks
        } = this.activePiece; // Деструктуризация активной фигуры

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
                }

            }
        }
    };

    clearLines(){
        const rows = 20;
        const colomns = 10;
        let lines = [];

        for (let y = rows - 1; y >= 0; y--) {
            let numberOfBlocks = 0;
            for (let x = 0; x < colomns; x++) {
                if(this.playfield[y][x]){
                    numberOfBlocks += 1;
                }
            }
            if(numberOfBlocks === 0){
                break;
            }else if(numberOfBlocks < colomns){
                continue;
            }else if(numberOfBlocks === colomns){
                lines.unshift(y);
            }
            
        }
        for(let index of lines){
            this.playfield.splice(index, 1);
            this.playfield.unshift(new Array(colomns).fill(0));
        }
        return lines.length;

    }
    updateScore(clearedLines){
        if(clearedLines > 0){
            this.score += Game.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
        }
    }

    updatePieces(){
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }





}