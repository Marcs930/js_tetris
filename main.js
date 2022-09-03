// フィールドサイズ
// マス目
const FIELD_COL = 10;
const FIELD_ROW = 20;

// 1ブロックあたりの一辺のサイズ
// ピクセル
const BLOCK_SIZE = 30;

// スクリーンサイズ
// 全体の長さpx = 1ブロックのpx * マス目数
const SCREEN_W = BLOCK_SIZE * FIELD_COL;
const SCREEN_H = BLOCK_SIZE * FIELD_ROW;

// テトロミノのサイズ
// 4マス×4マス
const TETRO_SIZE = 4;

// canvasを取得
let canvas = document.querySelector("#canvas");
// canvasに描画するために必要
let ctx = canvas.getContext("2d");

// 描画範囲をスクリーンのサイズと同じにする
canvas.width = SCREEN_W;
canvas.height = SCREEN_H;

// テトロミノを二次元配列で表現
// 1がある所にマスが存在する
// tetro[y][x]で1テトロを表現
let tetro = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
];

// テトロミノの座標（位置）
// 左上が頂点
let tetro_x = 0;
let tetro_y = 0;

// フィールド本体
// マス目の配列として初期化
let field = [];

// 初期化
function init() {
    for (let y = 0; y < FIELD_ROW; y++) {
        // fieldは二次元配列であることを宣言する
        // xのfor文内で二次元配列として使用できる様になる
        field[y] = [];
        // field[0]= [0,0,0,0]
        // field[1]= [0,0,0,0]
        // field[2]= [0,0,0,0]
        // field[3]= [0,0,0,0]
        for (let x = 0; x < FIELD_COL; x++) {
            field[y][x] = 0;
            // 全マス0にする（フィールドの全マスを初期化）
        }
    }
    // テスト 任意のマスを1にしてマスを存在させる
    field[0][0] = 1;
    field[0][9] = 1;
    field[5][5] = 1;
    field[19][9] = 1;
    field[19][0] = 1;
}

init();

// ブロックを一つ描画
function drawBlock(x, y) {
    let px = x * BLOCK_SIZE;
    let py = y * BLOCK_SIZE;
    ctx.fillStyle = "red";
    ctx.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "black";
    ctx.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
}

// フィールドとテトロミノを描画する
function drawAll() {
    // 一旦全部削除する
    ctx.clearRect(0, 0, SCREEN_W, SCREEN_H);

    for (let y = 0; y < FIELD_ROW; y++) {
        for (let x = 0; x < FIELD_COL; x++) {
            if (field[y][x]) {
                drawBlock(x, y);
            }
        }
    }

    // テトロを1つづつ描画
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            if (tetro[y][x]) {
                drawBlock(tetro_x + x, tetro_y + y);
            }
        }
    }
}

// フィールドとテトロを表示
drawAll();

// ブロックの衝突判定
function checkMove(mx, my , ntetro) {
    if( ntetro == undefined) ntetro = tetro;
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            let nx = tetro_x + x + mx;
            let ny = tetro_y + y + my;
            if (ntetro[y][x]) {
                if (
                    field[ny][nx] ||
                    ny < 0 ||
                    nx < 0 ||
                    ny >= FIELD_ROW ||
                    nx >= FIELD_COL
                ) {
                    return false;
                }
            }
        }
    }
    return true;
}

// テトロの回転
function rotate() {
    let ntetro = []
    for (let y = 0; y < TETRO_SIZE; y++) {
        ntetro[y] = []
        for (let x = 0; x < TETRO_SIZE; x++) {
            ntetro[y][x] = tetro[TETRO_SIZE - x - 1][y]
        }
    }
    return ntetro
}

// 落ちるスピード
const GAME_SPEED = 500;

setInterval(dropTetro, GAME_SPEED)

function dropTetro() {
    if (checkMove(0, 1)) tetro_y++;
    drawAll();
}

// キーボード操作を取得
document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37: //←
            if (checkMove(-1, 0)) tetro_x--;
            break;
        case 38: //↑
            if (checkMove(0, -1)) tetro_y--;
            break;
        case 39: //→
            if (checkMove(1, 0)) tetro_x++;
            break;
        case 40: //↓
            if (checkMove(0, 1)) tetro_y++;
            break;
        case 32: //スペース テトロミノ右回転
            let ntetro = rotate();
            if(checkMove(0, 0, ntetro) )tetro = ntetro;
            break;
    }
    drawAll();
    // macから編集
};
