document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable-item');
    const slots = document.querySelectorAll('.slot');
    const optionsGrid = document.querySelector('.options-grid');
    const submitBtn = document.getElementById('submit-btn');
    const timerDisplay = document.getElementById('timer');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const restartBtn = document.getElementById('restart-btn');

    let timeLeft = 300; // 5 minutes in seconds
    let timerInterval;
    let isGameActive = true;

    // --- Timer Logic ---
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (!isGameActive) return;

            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`;

            if (timeLeft <= 0) {
                endGame(false, "Hết giờ! Bạn chưa hoàn thành nhiệm vụ.");
            }
        }, 1000);
    }

    startTimer();

    // --- Drag & Drop Logic ---
    let draggedItem = null;

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            if (!isGameActive) return;
            draggedItem = draggable;
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggedItem = null;
            draggable.classList.remove('dragging');
        });
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault(); // Allow drop
            if (!isGameActive) return;
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            if (!isGameActive || !draggedItem) return;

            // If slot already has an item, return it to the grid? Or swap?
            // Simple logic: if slot has item, move that item back to grid first
            if (slot.children.length > 0) {
                const existingItem = slot.children[0];
                optionsGrid.appendChild(existingItem);
            }

            slot.appendChild(draggedItem);
        });
    });

    // Allow dragging back to the options grid
    optionsGrid.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    optionsGrid.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!isGameActive || !draggedItem) return;
        optionsGrid.appendChild(draggedItem);
    });

    // --- Validation Logic ---
    // Defined correct mappings based on flow
    // 1: Tìm kiếm (1, 1-alt)
    // 2: Hẹn gặp / Kết nối (2, 2-alt)
    // 3: Giới thiệu / Tư vấn (3, 3-alt)
    // 4: Xử lý từ chối (4)
    // 5: Chốt hợp đồng (5)
    // Extra: 6 (Chăm sóc sau bán) - Where does it go? 
    // The image has 5 slots. But typical sales flow is 5-7 steps.
    // Based on the image, the slots are empty.
    // Let's assume the order is:
    // Slot 1: Tim Kiem (Find)
    // Slot 2: Hen Gap / Ket Noi (Connect)
    // Slot 3: Gioi Thieu / Tu Van (Present)
    // Slot 4: Xu Ly Tu Choi (Objection)
    // Slot 5: Chot Hop Dong (Close)
    // (After sales is usually step 6, but there are only 5 slots)

    // We will verify strictly based on the prefix of data-id match with slot data-step

    submitBtn.addEventListener('click', () => {
        if (!isGameActive) return;

        let correctCount = 0;
        let filledCount = 0;

        slots.forEach(slot => {
            if (slot.children.length === 0) return;
            filledCount++;

            const item = slot.children[0];
            const slotStep = slot.getAttribute('data-step'); // 1, 2, 3, 4, 5
            const itemId = item.getAttribute('data-id'); // 1, 1-alt, etc.

            // Check if itemId starts with slotStep
            if (itemId.startsWith(slotStep)) {
                correctCount++;
            }
        });

        if (filledCount < 5) {
            alert("Bạn hãy điền đầy đủ các bước vào ô trống!");
            return;
        }

        if (correctCount === 5) {
            endGame(true, "Chúc mừng! Bạn đã sắp xếp đúng quy trình chăm sóc khách hàng.");
        } else {
            // Provide hint or just fail?
            // Let's just say try again to keep it simple
            endGame(false, "Rất tiếc, quy trình chưa chính xác. Hãy thử lại!");
        }
    });

    function endGame(isWin, message) {
        isGameActive = false;
        clearInterval(timerInterval);
        modalTitle.textContent = isWin ? "Thành Công" : "Thất Bại";
        modalTitle.style.color = isWin ? "#16a34a" : "#dc2626";
        modalMessage.textContent = message;
        modal.classList.remove('hidden');
    }

    restartBtn.addEventListener('click', () => {
        window.location.reload();
    });
});
