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

// テトロカラー
const TETRO_COLORS = [
    "#", //0空
    "#6CF", //1水色
    "#F92", //2オレンジ
    "#66F", //3青
    "#C5C", //4紫
    "#FD2", //5黄色
    "#F44", //6赤
    "#5B5", //7緑
];

// テトロを全種類定義
const TETRO_TYPES = [
    [], // 0.からのテトロ
    [
        // 1.I
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        // 2.L
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    [
        // 3.J
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    [
        // 4.T
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        // 5.0
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    [
        // 6.Z
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ],
    [
        // 7.S
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
    ],
];

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

// テトロミノの種類番号
let tetro_t;

tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;

// テトロミノを二次元配列で表現
// 1がある所にマスが存在する
// tetro[y][x]で1テトロを表現
let tetro;

tetro = TETRO_TYPES[tetro_t];

const START_X = FIELD_COL / 2 - TETRO_SIZE / 2;
const START_Y = 0;

// テトロミノの座標（位置）
// 左上が頂点
let tetro_x = START_X;
let tetro_y = START_Y;

// ゲームオーバーフラグ
let over = false;

// 消したライン数
let lines = 0;
// スコア
let score = 0;

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
}

init();

// ブロックを一つ描画
function drawBlock(x, y, c) {
    let px = x * BLOCK_SIZE;
    let py = y * BLOCK_SIZE;
    ctx.fillStyle = TETRO_COLORS[c];
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
                drawBlock(x, y, field[y][x]);
            }
        }
    }

    // テトロを1つづつ描画
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            if (tetro[y][x]) {
                drawBlock(tetro_x + x, tetro_y + y, tetro_t);
            }
        }
    }

    if(over) {
        let s = "GAME OVER";
        ctx.font = "40px 'sans-serif'"
        let w = ctx.measureText(s).width;
        let x = SCREEN_W / 2 - w / 2;
        let y = SCREEN_H / 2 - 20;
        ctx.lineWidth = 5
        ctx.strokeText(s, x, y)
        ctx.fillStyle = 'White'
        ctx.fillText(s, x, y)

    }
}

// フィールドとテトロを表示
drawAll();

// ブロックの衝突判定
function checkMove(mx, my, ntetro) {
    if (ntetro == undefined) ntetro = tetro;
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            if (ntetro[y][x]) {
                let nx = tetro_x + x + mx;
                let ny = tetro_y + y + my;
                if (
                    ny < 0 ||
                    nx < 0 ||
                    ny >= FIELD_ROW ||
                    nx >= FIELD_COL ||
                    field[ny][nx]
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
    let ntetro = [];
    for (let y = 0; y < TETRO_SIZE; y++) {
        ntetro[y] = [];
        for (let x = 0; x < TETRO_SIZE; x++) {
            ntetro[y][x] = tetro[TETRO_SIZE - x - 1][y];
        }
    }
    return ntetro;
}

// 落ちるスピード
const GAME_SPEED = 400;

// テトロが一定間隔で落ちていく
setInterval(dropTetro, GAME_SPEED);

function fixTetro() {
    for (let y = 0; y < TETRO_SIZE; y++) {
        for (let x = 0; x < TETRO_SIZE; x++) {
            if (tetro[y][x]) {
                field[tetro_y + y][tetro_x + x] = tetro_t;
            }
        }
    }
}

// ラインが揃ったかチェックして消す
function checkLine() {

    let lineCount;

    for (let y = 0; y < FIELD_ROW; y++) {
        let flag = true
        for (let x = 0; x < FIELD_COL; x++) {

            if ((!field[y][x])     ) {
                flag = false
                break;
            }
        }
        if(flag) {
            lineCount++;
           for(let ny = y; ny > 0; ny--) {
            for( let nx = 0; nx < FIELD_COL; nx++) {
                field[ny][nx] = field[ny-1][nx]
            }
           }
        }
    }
}

// テトロが落ちていく処理
function dropTetro() {

    if(over) return;

    // 下に動ける場合は移動させる
    if (checkMove(0, 1)) tetro_y++;
    else {
        // 下に動けないときに固定
        fixTetro();
        // ラインが揃っているか確認
        checkLine();

        // tetro_t = Math.floor(Math.random() * TETRO_TYPES.length - 1) + 1;
        tetro_t = Math.floor(Math.random() * (TETRO_TYPES.length - 1)) + 1;
        tetro = TETRO_TYPES[tetro_t];

        tetro_x = START_X;
        tetro_y = START_Y;

        if(!checkMove(0, 0)) {
            over = true;
        }
    }
    drawAll();
}

// キーボード操作を取得
document.onkeydown = function (e) {
    if(over) return;
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
            if (checkMove(0, 0, ntetro)) tetro = ntetro;
            break;
    }
    drawAll();
    // macから編集
};
