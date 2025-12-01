// Элементы таймера
let timerDisplay = document.getElementById('timer');
let startBtn = document.getElementById('startBtn');
let pauseBtn = document.getElementById('pauseBtn');
let timerStatus = document.getElementById('timerStatus');

let workTime = 25 * 60; // в секундах
let breakTime = 5 * 60;
let timeLeft = workTime;
let timerInterval = null;
let isRunning = false;
let isWorkPhase = true;

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.title = `${timerDisplay.textContent} - Менеджер отдыха`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        timerStatus.textContent = isWorkPhase ? "Работайте! Сосредоточьтесь." : "Перерыв! Расслабьтесь.";

        timerInterval = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft < 0) {
                clearInterval(timerInterval);
                // Переключаем фазу
                isWorkPhase = !isWorkPhase;
                timeLeft = isWorkPhase ? workTime : breakTime;
                updateDisplay();

                // Уведомление (браузерное)
                let message = isWorkPhase ? "Перерыв окончен. Время работать!" : "Рабочая сессия завершена! Пора отдохнуть.";
                timerStatus.textContent = message;
                if (Notification.permission === "granted") {
                    new Notification(message);
                } else if (Notification.permission !== "denied") {
                    Notification.requestPermission();
                }

                // Обновляем статистику
                if (!isWorkPhase) { // Если только что закончили рабочую сессию
                    let sessionsElement = document.getElementById('sessionsCompleted');
                    sessionsElement.textContent = parseInt(sessionsElement.textContent) + 1;
                }
                // Запускаем таймер для следующей фазы автоматически
                startTimer();
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    timerStatus.textContent = "На паузе.";
}

function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    isWorkPhase = true;
    timeLeft = workTime;
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    timerStatus.textContent = "Готово к работе. Нажмите 'Старт'.";
}

function applySettings() {
    let newWorkTime = parseInt(document.getElementById('workTime').value);
    let newBreakTime = parseInt(document.getElementById('breakTime').value);
    workTime = newWorkTime * 60;
    breakTime = newBreakTime * 60;
    if (!isRunning) {
        timeLeft = workTime;
        updateDisplay();
    }
    alert("Настройки таймера применены!");
}

// Управление списком идей для отдыха
function addRestIdea() {
    let input = document.getElementById('restIdeaInput');
    let ideaText = input.value.trim();
    if (ideaText === "") return;

    let list = document.getElementById('restIdeasList');
    let li = document.createElement('li');
    li.innerHTML = `<span>${ideaText}</span> <button class="delete-btn" onclick="this.parentElement.remove()"><i class="fas fa-trash"></i></button>`;
    list.appendChild(li);
    input.value = "";
}

// Инициализация
updateDisplay();
pauseBtn.disabled = true;

// Запрос на уведомления
if ("Notification" in window && Notification.permission === "default") {
    setTimeout(() => {
        Notification.requestPermission();
    }, 2000);
}
