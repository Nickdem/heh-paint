const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const range = document.getElementById('range')
const colorButtons = document.querySelectorAll('.colors__button')
const mode = document.getElementById('mode')
const save = document.getElementById('save')
const picker = document.getElementById('picker')

let painting = false
let filling = false


ctx.fillStyle = "white"
ctx.fillRect(0, 0, canvas.dataset.w, canvas.dataset.h)
ctx.lineWidth = range.value
ctx.strokeStyle = "#000000"
ctx.fillStyle = ctx.strokeStyle
canvas.height = canvas.dataset.h
canvas.width = canvas.dataset.w

picker.addEventListener('change', function(e) {
    ctx.strokeStyle = e.target.value
    ctx.fillStyle = ctx.strokeStyle
})

range.addEventListener('change', function (e) {
    ctx.lineWidth = e.target.value
})

function changeColor(e) {
    colorButtons.forEach(btn => btn.classList.remove('active'))
    e.target.classList.add('active')
    ctx.strokeStyle = e.target.dataset.color
    ctx.fillStyle = ctx.strokeStyle
}

colorButtons.forEach(btn => btn.addEventListener('click', changeColor))

mode.addEventListener('click', function () {
    filling = !filling

    if (filling) {
        mode.innerText = 'Заливка'
    } else {
        mode.innerText = 'Рисование'
    }
})

save.addEventListener('click', function() {
    const link = document.createElement('a')
    link.href = canvas.toDataURL()
    link.download = 'your paint'
    link.click()
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