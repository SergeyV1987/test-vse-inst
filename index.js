let data = {};
let table = document.getElementById('tbody');

function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', false);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function init() {
    loadJSON(function (response) {
        data = JSON.parse(response);
    });
}

init();

function countLength(end, start) {
    return (Date.parse(end) - Date.parse(start)) / 3600000;
}

function countWorkStart(start) {
    let startDate = new Date(start);
    return startDate.getUTCMinutes() + startDate.getUTCHours() * 60;
}


for (let i = 0; i < data.virtual.length; i += 1) {
    const line = document.createElement('tr');
    line.classList.add('line');

    for (let j = 0; j < 26; j += 1) {
        const cell = document.createElement('td');
        cell.classList.add('cell');

        if (j === 0) {
            cell.innerHTML = data.virtual[i][0];
        }

        if (j === 1) {
            cell.innerHTML = `${data.virtual[i][1]} / ${data.virtual[i][2]}`
        }

        if (j === 2) {
            const cellWidth = 52;
            const minutesInHour = 60;
            const span = document.createElement('span');
            const virtualSchedule = countLength(data.virtual[i][4], data.virtual[i][3]) * cellWidth + 'px';
            const virtualScheduleStart = countWorkStart(data.virtual[i][3]) * (cellWidth / minutesInHour) + 'px';
            const actualSchedule = countLength(data.actual[i][4], data.actual[i][3]) * cellWidth + 'px';
            const actualScheduleStart = countWorkStart(data.actual[i][3]) * (cellWidth / minutesInHour) + 'px';

            span.style.width = virtualSchedule;
            span.style.left = virtualScheduleStart;
            span.style.background = "black";
            cell.appendChild(span);

            span.addEventListener("click", () => {
                if (span.style.width === virtualSchedule) {
                    span.style.width = actualSchedule;
                    span.style.left = actualScheduleStart;
                    span.style.background = `repeating-linear-gradient(125deg, black, grey, black 10px)`;
                } else {
                    span.style.width = virtualSchedule;
                    span.style.left = virtualScheduleStart;
                    span.style.background = "black";
                }
            })
        }

        line.appendChild(cell);
    }

    table.appendChild(line);
}

