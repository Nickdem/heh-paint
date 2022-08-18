import { buttons } from './content.js'


let opt = {
    counter: 0,
    figure: null,
    mode: 'Рисование'
}

function canvasOptions() {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.dataset.w, canvas.dataset.h)
    ctx.lineWidth = range.value
    ctx.strokeStyle = "#000000"
    ctx.fillStyle = ctx.strokeStyle
    canvas.height = canvas.dataset.h
    canvas.width = canvas.dataset.w

    return { ctx, canvas }
}

function initRange(c) {
    const range = document.getElementById('range')

    range.addEventListener('change', function (e) {
        c.lineWidth = e.target.value
    })
}


function makeButton(btn) {
    return `<button class="colors__button ${btn.class == 'black' ? btn.class + ' active' : btn.class}" data-color="${btn.color}"></button>`
}


function makeButtons(c) {
    const colors = document.getElementById('colors')
    colors.insertAdjacentHTML('afterbegin', buttons.map(btn => makeButton(btn)).join(' '))

    const colorButtons = Array.from(colors.children)

    function changeColor(e) {
        colorButtons.forEach(btn => btn.classList.remove('active'))
        e.target.classList.add('active')
        c.strokeStyle = e.target.dataset.color
        c.fillStyle = c.strokeStyle
    }

    colorButtons.forEach(btn => btn.addEventListener('click', changeColor))
}

function initMode() {
    const mode = document.getElementById('mode')

    mode.addEventListener('click', function () {

        if (mode.innerText == 'Рисование') {
            opt.mode = 'Заливка'
        } else {
            opt.mode = 'Рисование'
        }
        mode.innerText = opt.mode
    })
}

function initSave(c) {
    const save = document.getElementById('save')
    save.addEventListener('click', function () {
        const link = document.createElement('a')
        link.href = c.toDataURL()
        link.download = 'your paint'
        link.click()
    })
}

function initPicker(c) {
    const picker = document.getElementById('picker')

    picker.addEventListener('change', function (e) {
        c.strokeStyle = e.target.value
        c.fillStyle = c.strokeStyle
    })
}



function makeSquare(ctx, { x1, x2, y1, y2, figure }) {
    figure == 'squareOutline' ? ctx.strokeRect(x1, y1, x2 - x1, y2 - y1) : ctx.fillRect(x1, y1, x2 - x1, y2 - y1)
}

function makeTriangle(ctx, { x1, x2, y1, y2, x3, y3, figure }) {
    if (figure == 'triangleOutline') {
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.lineTo(x3, y3)
        ctx.lineTo(x1, y1)
        ctx.stroke()

    } else {
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.lineTo(x3, y3)
        ctx.fill()
    }
}

function makeLine(ctx, { x1, x2, y1, y2 }) {
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
}

function makeCircle(ctx, { x1, x2, y1, y2, figure }) {
    let radX = x2 > x1 ? (x2 - x1) / 2 : (x1 - x2) / 2
    let radY = y2 > y1 ? (y2 - y1) / 2 : (y1 - y2) / 2
    let rad = radX

    if (rad < 15) {
        rad = radY
    }

    ctx.arc(x1 + ((x2 - x1) / 2), y1 + ((y2 - y1) / 2), rad, 0, getRadians(360))

    if (figure == 'circle') {
        ctx.fill()
    } else {
        ctx.stroke()
    }

    function getRadians(degrees) {
        return (Math.PI / 180) * degrees;
    }
}


export function initCanvas() {
    const { ctx, canvas } = canvasOptions()

    initRange(ctx)
    makeButtons(ctx)

    let painting = false

    initMode()
    initSave(canvas)
    initPicker(ctx)

    const fig = document.getElementById('figure')
    fig.addEventListener('change', function (e) {
        opt.figure = e.target.value
    })

    canvas.addEventListener("mousemove", function (e) {
        if (!painting) {
            ctx.beginPath()
            ctx.moveTo(e.offsetX, e.offsetY)
        } else {
            ctx.lineTo(e.offsetX, e.offsetY)
            ctx.stroke()
        }
    })

    canvas.addEventListener("mousedown", function (e) {
        if (opt.mode == 'Рисование' && e.button == 0 && !opt.figure) {
            painting = true
        }
    })

    canvas.addEventListener("mouseup", function (e) {
        painting = false
    })

    canvas.addEventListener("mouseleave", function (e) {
        painting = false
    })

    function toBase() {
        opt.counter = 0
        opt.figure = null
        fig.value = 'base'
    }

    canvas.addEventListener("click", function (e) {
        if (opt.mode == 'Заливка') {
            ctx.fillRect(0, 0, canvas.dataset.w, canvas.dataset.h)
        }

        if (opt.figure) {
            console.log(opt);
            opt.counter += 1
            opt[`x${opt.counter}`] = e.offsetX
            opt[`y${opt.counter}`] = e.offsetY

            if (opt.counter == 2 && opt.figure.indexOf('triangle') < 0) {
                if (opt.figure == 'line') {
                    makeLine(ctx, opt)
                }
                if (opt.figure == 'square' || opt.figure == "squareOutline") {
                    makeSquare(ctx, opt)
                }
                if (opt.figure == 'circle' || opt.figure == "circleOutline") {
                    makeCircle(ctx, opt)
                }

                toBase()
            }


            if (opt.counter == 3 && opt.figure.indexOf('triangle') >= 0) {
                makeTriangle(ctx, opt)
                toBase()
            }
        }
    })

    canvas.addEventListener("contextmenu", function (e) {
        e.preventDefault()
    })
}
