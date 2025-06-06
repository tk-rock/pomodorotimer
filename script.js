document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const workTimeInput = document.getElementById('work-time');
    const breakTimeInput = document.getElementById('break-time');
    const longBreakTimeInput = document.getElementById('long-break-time');
    const cyclesInput = document.getElementById('cycles');
    const cycleCountEl = document.getElementById('cycle-count');
    const totalCyclesEl = document.getElementById('total-cycles');
    const currentModeEl = document.getElementById('current-mode');
    const notificationToggle = document.getElementById('notification-toggle');
    const soundToggle = document.getElementById('sound-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const notificationSound = document.getElementById('notification-sound');
    const progressRing = document.querySelector('.progress-ring-circle');

    // Timer variables
    let timer;
    let minutes;
    let seconds;
    let isRunning = false;
    let currentMode = 'work'; // 'work', 'break', 'longBreak'
    let currentCycle = 0;
    let totalTime;
    let timeRemaining;
    const circumference = 2 * Math.PI * 120; // 2πr, r=120 (from SVG)
    
    // Request notification permission on page load
    if ('Notification' in window) {
        Notification.requestPermission();
    }

    // Initialize timer display
    updateTimerDisplay();
    updateCycleDisplay();

    // Event listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    workTimeInput.addEventListener('change', updateSettings);
    breakTimeInput.addEventListener('change', updateSettings);
    longBreakTimeInput.addEventListener('change', updateSettings);
    cyclesInput.addEventListener('change', updateSettings);
    themeToggle.addEventListener('change', () => {
        const theme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(theme);
        localStorage.setItem('theme', theme);
    });

    // Functions
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            
            // If timer was reset or just initialized
            if (minutes === parseInt(workTimeInput.value) && seconds === 0 && currentMode === 'work') {
                totalTime = minutes * 60;
                timeRemaining = totalTime;
            }
            
            timer = setInterval(() => {
                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else {
                    // Timer completed
                    clearInterval(timer);
                    isRunning = false;
                    
                    // Play sound if enabled
                    if (soundToggle.checked) {
                        notificationSound.play();
                    }
                    
                    // Show notification if enabled
                    if (notificationToggle.checked && Notification.permission === 'granted') {
                        let message = '';
                        if (currentMode === 'work') {
                            message = '作業時間が終了しました。休憩しましょう！';
                        } else if (currentMode === 'break' || currentMode === 'longBreak') {
                            message = '休憩時間が終了しました。作業を再開しましょう！';
                        }
                        
                        new Notification('ポモドーロタイマー', {
                            body: message,
                            icon: 'https://cdn-icons-png.flaticon.com/512/3588/3588294.png'
                        });
                    }
                    
                    // Update mode and cycle
                    if (currentMode === 'work') {
                        currentCycle++;
                        updateCycleDisplay();
                        
                        // Check if it's time for a long break
                        if (currentCycle % parseInt(cyclesInput.value) === 0) {
                            currentMode = 'longBreak';
                            minutes = parseInt(longBreakTimeInput.value);
                            currentModeEl.textContent = '長い休憩';
                        } else {
                            currentMode = 'break';
                            minutes = parseInt(breakTimeInput.value);
                            currentModeEl.textContent = '休憩';
                        }
                    } else {
                        // After any break, go back to work mode
                        currentMode = 'work';
                        minutes = parseInt(workTimeInput.value);
                        currentModeEl.textContent = '作業';
                    }
                    
                    seconds = 0;
                    totalTime = minutes * 60;
                    timeRemaining = totalTime;
                    updateTimerDisplay();
                    updateProgressRing();
                    
                    // Auto-start next session
                    startTimer();
                }
                
                timeRemaining = (minutes * 60) + seconds;
                updateTimerDisplay();
                updateProgressRing();
            }, 1000);
        }
    }

    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        pauseBtn.classList.add('hidden');
        startBtn.classList.remove('hidden');
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        currentMode = 'work';
        currentModeEl.textContent = '作業';
        minutes = parseInt(workTimeInput.value);
        seconds = 0;
        currentCycle = 0;
        totalTime = minutes * 60;
        timeRemaining = totalTime;
        
        updateTimerDisplay();
        updateCycleDisplay();
        updateProgressRing();
        
        pauseBtn.classList.add('hidden');
        startBtn.classList.remove('hidden');
    }

    function updateTimerDisplay() {
        minutesEl.textContent = minutes < 10 ? `0${minutes}` : minutes;
        secondsEl.textContent = seconds < 10 ? `0${seconds}` : seconds;
    }

    function updateCycleDisplay() {
        cycleCountEl.textContent = currentCycle;
        totalCyclesEl.textContent = cyclesInput.value;
    }

    function updateProgressRing() {
        const progress = timeRemaining / totalTime;
        const dashoffset = circumference * (1 - progress);
        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = dashoffset;
    }

    function updateSettings() {
        // Update cycles display
        totalCyclesEl.textContent = cyclesInput.value;
        
        // Only update timer if not running
        if (!isRunning) {
            minutes = parseInt(workTimeInput.value);
            seconds = 0;
            totalTime = minutes * 60;
            timeRemaining = totalTime;
            updateTimerDisplay();
            updateProgressRing();
        }
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.checked = true;
        } else {
            document.body.classList.remove('dark-theme');
            themeToggle.checked = false;
        }
    }

    // Initialize
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    resetTimer();
});
