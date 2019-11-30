export default class Game {
    score = 0;
    lines = 0;
    level = 0;
    playfield = [ // Игровое поле
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    activePiece = { // Активная фигура
        x: 0,
        y: 0,
        get blocks() {
            return this.rotations[this.rotationIndex];
        },
        rotationIndex: 0,
        rotations: [
            [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            [
                [0, 1, 0],
                [0, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ],
            [
                [0, 1, 0],
                [1, 1, 0],
                [0, 1, 0]
            ],
        ]
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
            this.lockPiece(); // Если встретили другую фигуру или нижнюю границу поля, то фиксируем фигуру на этом месте
        }
    }

    rotationPiece() { // Метод поворота фигуры
        this.activePiece.rotationIndex = this.activePiece.rotationIndex < 3 ? this.activePiece.rotationIndex + 1 : 0;

        if (this.hasCollision()) {
            this.activePiece.rotationIndex = this.activePiece.rotationIndex > 0 ? this.activePiece.rotationIndex - 1 : 3;
        }

        return this.activePiece.rotations[this.activePiece.rotationIndex];

    }

    hasCollision() { //Метод проверяющий выход за пределы поля
        const {
            y: pieceY,
            x: pieceX,
            blocks
        } = this.activePiece; // Деструктуризация активной фигуры
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
    // STANDART ROTATION SISTEM(SRS) -------------------------------------------------------------





}