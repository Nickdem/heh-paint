import { buttons } from './content.js'

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
    return `<button class="colors__button ${btn.class}" data-color="${btn.color}"></button>`
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

let filling = false

function initMode() {
    const mode = document.getElementById('mode')

    mode.addEventListener('click', function () {
        filling = !filling
        
        if (filling) {
            mode.innerText = 'Заливка'
        } else {
            mode.innerText = 'Рисование'
        }
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

export function initCanvas() {
    const { ctx, canvas } = canvasOptions()

    initRange(ctx)
    makeButtons(ctx)

    let painting = false
    

    initMode()
    initSave(canvas)
    initPicker(ctx)

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
        if (!filling) {
            painting = true
        }
    })

    canvas.addEventListener("mouseup", function (e) {
        painting = false
    })

    canvas.addEventListener("mouseleave", function (e) {
        painting = false
    })

    canvas.addEventListener("click", function (e) {
        if (filling) {
            ctx.fillRect(0, 0, canvas.dataset.w, canvas.dataset.h)
        }
    })

    canvas.addEventListener("contextmenu", function (e) {
        e.preventDefault()
    })
}
