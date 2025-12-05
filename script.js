// Массив с путями к изображениям пазлов
const puzzleImages = [
    'puz1.jpg',
    'puz2.jpg',
    'puz3.jpg',
    'puz4.jpg',
    'puz5.jpg',
    'puz6.jpg',
    'puz7.jpg',
    'puz8.jpg',
    'puz9.jpg',
    'puz10.jpg',
    'puz11.jpg',
    'puz12.jpg',
    'puz13.jpg',
    'puz14.jpg',
    'puz15.jpg',
    'puz16.jpg',
    'puz17.jpg',
    'puz18.jpg',
    'puz19.jpg',
    'puz20.jpg',
    'puz21.jpg',
    'puz22.jpg',
    'puz23.jpg',
    'puz24.jpg',
    'puz25.jpg',
    'puz26.jpg',
];

// Глобальные переменные
let currentGame = '';
let draggedPiece = null; // Для пазлов
let currentPuzzleImageUrl = ''; // Текущее изображение пазла
let currentPuzzleSize = 0; // Текущий размер пазла

// ==========================================
// СИСТЕМА УВЕДОМЛЕНИЙ-ПОЗДРАВЛЕНИЙ
// ==========================================

// Функция для показа уведомления
function showNotification(message, type = 'success') {
    const overlay = document.getElementById('notificationOverlay');
    const messageElement = document.getElementById('notificationMessage');
    
    // Устанавливаем сообщение
    messageElement.textContent = message;
    
    // Меняем цвет в зависимости от типа
    if (type === 'error') {
        document.querySelector('.notification-box').style.background = 
            'linear-gradient(135deg, #ff6b6b 0%, #c44569 100%)';
        document.querySelector('.notification-header h3').textContent = '⚠️ Ошибка!';
    } else {
        document.querySelector('.notification-box').style.background = 
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        document.querySelector('.notification-header h3').textContent = '🎉 Поздравляем!';
    }
    
    // Показываем уведомление
    overlay.classList.add('active');
    
    // Автоматическое скрытие через 5 секунд (опционально)
    setTimeout(() => {
        if (overlay.classList.contains('active')) {
            hideNotification();
        }
    }, 5000);
}

// Функция для скрытия уведомления
function hideNotification() {
    const overlay = document.getElementById('notificationOverlay');
    overlay.classList.remove('active');
}

// Закрытие по нажатию ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        hideNotification();
    }
});

// Закрытие по клику на фон (опционально)
document.getElementById('notificationOverlay').addEventListener('click', function(e) {
    if (e.target === this) {
        hideNotification();
    }
});

// Функция для удаления кнопок пазлов
function removePuzzleButtons() {
    const puzzleResetBtn = document.getElementById('puzzleResetButton');
    if (puzzleResetBtn) {
        puzzleResetBtn.remove();
    }
    
    const puzzleShowImageBtn = document.getElementById('puzzleShowImageButton');
    if (puzzleShowImageBtn) {
        puzzleShowImageBtn.remove();
    }
}
 
// Главные функции навигации
function showMainMenu() {
    removePuzzleButtons(); // Удаляем кнопки пазлов
    document.getElementById('mainMenu').classList.add('active');
    document.getElementById('gameContainer').classList.remove('active');
    document.getElementById('puzzleImageScreen').classList.remove('active');
    document.getElementById('gameContainer').innerHTML = '';
    
    document.getElementById('homeButton').classList.remove('active');
    document.getElementById('levelSelectButton').classList.remove('active');
    
    // Скрываем кнопку возврата на экране изображения
    const backToPuzzleBtn = document.getElementById('backToPuzzleButton');
    if (backToPuzzleBtn) {
        backToPuzzleBtn.style.display = 'none';
    }
    
    // Скрываем уведомление если открыто
    hideNotification();
}
 
function showGame(gameName) {
    removePuzzleButtons(); // Удаляем кнопки пазлов
    currentGame = gameName;
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('gameContainer').classList.add('active');
    document.getElementById('puzzleImageScreen').classList.remove('active');
    
    document.getElementById('homeButton').classList.add('active');
    document.getElementById('levelSelectButton').classList.remove('active');
    
    const gameContainer = document.getElementById('gameContainer');
    gameContainer.innerHTML = '';
    
    showLevelSelection(gameName);
    
    // Скрываем кнопку возврата на экране изображения
    const backToPuzzleBtn = document.getElementById('backToPuzzleButton');
    if (backToPuzzleBtn) {
        backToPuzzleBtn.style.display = 'none';
    }
    
    // Скрываем уведомление если открыто
    hideNotification();
}
 
function showLevelSelectionForCurrentGame() {
    if (currentGame) {
        showLevelSelection(currentGame);
    }
}
 
function showLevelSelection(gameName) {
    removePuzzleButtons(); // Удаляем кнопки пазлов
    
    const gameContainer = document.getElementById('gameContainer');
    
    let levels = [];
    let levelLabels = [];
    let gameTitle = '';
    
    switch(gameName) {
        case 'memory':
            gameTitle = 'Карточки';
            levels = [4, 6, 8, 10, 12];
            levelLabels = ['Уровень 1 (4 пары)', 'Уровень 2 (6 пар)', 'Уровень 3 (8 пар)', 'Уровень 4 (10 пар)', 'Уровень 5 (12 пар)'];
            break;
        case 'puzzle':
            gameTitle = 'Пазлы';
            levels = [3, 4, 5, 6, 7];
            levelLabels = ['Уровень 1 (3x3)', 'Уровень 2 (4x4)', 'Уровень 3 (5x5)', 'Уровень 4 (6x6)', 'Уровень 5 (7x7)'];
            break;
        case 'schulte':
            gameTitle = 'Таблица Шульте';
            levels = [1, 2, 3, 4, 5];
            levelLabels = ['Уровень 1 (8 чисел)', 'Уровень 2 (16 чисел)', 'Уровень 3 (24 числа)', 'Уровень 4 (36 чисел)', 'Уровень 5 (48 чисел)'];
            break;
        case 'matrix':
            gameTitle = 'Матрица';
            levels = [4, 5, 6, 7, 8];
            levelLabels = ['Уровень 1 (4 клетки)', 'Уровень 2 (5 клеток)', 'Уровень 3 (6 клеток)', 'Уровень 4 (7 клеток)', 'Уровень 5 (8 клеток)'];
            break;
    }
    
    let levelsHTML = '';
    for (let i = 0; i < levels.length; i++) {
        levelsHTML += `
            <button class="level-btn" onclick="startGame('${gameName}', ${levels[i]})">
                ${levelLabels[i]}
            </button>
        `;
    }
    
    let backButtonHTML = '';
    
    gameContainer.innerHTML = `
        <h2>${gameTitle} - Выбор уровня</h2>
        <div class="level-selector">
            ${levelsHTML}
        </div>
        ${backButtonHTML}
    `;
    
    document.getElementById('levelSelectButton').classList.remove('active');
    
    // Скрываем уведомление если открыто
    hideNotification();
}
 
function startGame(gameName, level) {
    removePuzzleButtons(); // Удаляем кнопки пазлов
    document.getElementById('homeButton').classList.add('active');
    document.getElementById('levelSelectButton').classList.add('active');
    
    switch(gameName) {
        case 'memory':
            startMemoryGame(level);
            break;
        case 'puzzle':
            startPuzzleGame(level);
            break;
        case 'schulte':
            startSchulteGame(level);
            break;
        case 'matrix':
            startMatrixGame(level);
            break;
    }
    
    // Скрываем уведомление если открыто
    hideNotification();
}
 
// ==========================================
// ИГРА: КАРТОЧКИ (MEMORY)
// ==========================================
function startMemoryGame(pairs) {
    const animals = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐸', '🐵', '🐤', '🦄', '🐞'];
    const selectedAnimals = animals.slice(0, pairs);
    const cards = [...selectedAnimals, ...selectedAnimals];
    
    // Перемешиваем
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
 
    // Сетка
    let gridColumns = 4;
    if (pairs === 4) gridColumns = 4;
    else if (pairs === 6) gridColumns = 4;
    else if (pairs === 8) gridColumns = 4;
    else if (pairs === 10) gridColumns = 5;
    else if (pairs === 12) gridColumns = 6;
 
    const gameContainer = document.getElementById('gameContainer');
    
    // Определяем правильную форму слова "пары" в зависимости от количества
    const pairsWord = (pairs === 4) ? "пары" : "пар";
    
    let cardsHTML = '';
    cards.forEach((animal, index) => {
        cardsHTML += `
            <div class="memory-card" onclick="memoryFlipCard(this, ${index})">
                <div class="memory-card-inner">
                    <div class="memory-card-front"></div>
                    <div class="memory-card-back">${animal}</div>
                </div>
            </div>
        `;
    });
 
    gameContainer.innerHTML = `
        <h2>Найдите ${pairs} ${pairsWord} карточек</h2>
        <div class="memory-game" style="grid-template-columns: repeat(${gridColumns}, 100px);">
            ${cardsHTML}
        </div>
        <div class="memory-controls-bottom">
            <button class="control-btn reset" onclick="startMemoryGame(${pairs})">Начать заново</button>
        </div>
    `;
 
    window.memoryGameState = {
        cards: cards,
        flippedCards: [],
        matchedPairs: 0,
        totalPairs: pairs
    };
}
 
function memoryFlipCard(cardElement, index) {
    const gameState = window.memoryGameState;
    
    if (gameState.flippedCards.length === 2 || cardElement.classList.contains('flipped')) {
        return;
    }
 
    cardElement.classList.add('flipped');
    gameState.flippedCards.push({ element: cardElement, index });
 
    if (gameState.flippedCards.length === 2) {
        setTimeout(() => memoryCheckMatch(), 500);
    }
}
 
function memoryCheckMatch() {
    const gameState = window.memoryGameState;
    const [card1, card2] = gameState.flippedCards;
    const isMatch = gameState.cards[card1.index] === gameState.cards[card2.index];
 
    if (isMatch) {
        gameState.matchedPairs++;
        gameState.flippedCards = [];
        
        if (gameState.matchedPairs === gameState.totalPairs) {
            setTimeout(() => {
                showNotification('Вы успешно собрали все пары карточек! Уровень пройден!');
            }, 300);
        }
    } else {
        card1.element.classList.add('wrong');
        card2.element.classList.add('wrong');
        
        setTimeout(() => {
            card1.element.classList.remove('flipped', 'wrong');
            card2.element.classList.remove('flipped', 'wrong');
            gameState.flippedCards = [];
        }, 1000);
    }
}
 
// ==========================================
// ИГРА: ТАБЛИЦА ШУЛЬТЕ (ИСПРАВЛЕННАЯ ВЕРСИЯ)
// ==========================================
function startSchulteGame(level) {
    let totalCells, instructionText;
    let gridSize, cellSize, gapSize, tablePadding;
    
    // Определяем параметры для каждого уровня (только для ПК)
    switch(level) {
        case 1: // Уровень 1: 8 чисел (3x3 с пустым центром)
            totalCells = 8;
            instructionText = "Сосредоточьтесь на красной точке и находите числа по порядку от 1 до 8";
            gridSize = 3;
            cellSize = 90
            gapSize = 20;
            tablePadding = 30;
            break;
        case 2: // Уровень 2: 16 чисел (4x4 с увеличенными отступами)
            totalCells = 16;
            instructionText = "Сосредоточьтесь на красной точке и находите числа по порядку от 1 до 16";
            gridSize = 4;
            cellSize = 70;
            gapSize = 20;
            tablePadding = 45;
            break;
        case 3: // Уровень 3: 24 числа (5x5 с пустым центром)
            totalCells = 24;
            instructionText = "Сосредоточьтесь на красной точке и находите числа по порядку от 1 до 24";
            gridSize = 5;
            cellSize = 70;
            gapSize = 15;
            tablePadding = 30;
            break;
        case 4: // Уровень 4: 36 чисел (6x6 с увеличенными отступами)
            totalCells = 36;
            instructionText = "Сосредоточьтесь на красной точке и находите числа по порядку от 1 до 36";
            gridSize = 6;
            cellSize = 50;
            gapSize =20;
            tablePadding = 40;
            break;
        case 5: // Уровень 5: 48 чисел (7x7 с пустым центром)
            totalCells = 48;
            instructionText = "Сосредоточьтесь на красной точке и находите числа по порядку от 1 до 48";
            gridSize = 7;
            cellSize =50;
            gapSize = 15;
            tablePadding = 30;
            break;
        default:
            totalCells = 16;
            instructionText = "Сосредоточьтесь на красной точке и находите числа по порядку";
            gridSize = 4;
            cellSize = 90;
            gapSize = 20;
            tablePadding = 30;
    }
    
    const numbers = Array.from({length: totalCells}, (_, i) => i + 1);
    
    // Перемешиваем числа
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
 
    const gameContainer = document.getElementById('gameContainer');
    
    // Создаем ячейки таблицы
    let cellsHTML = '';
    let cellIndex = 0;
    
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            // Пропускаем центральную ячейку для уровней 1, 3 и 5
            const isCenterCell = 
                (level === 1 && row === 1 && col === 1) || // 3x3, центр
                (level === 3 && row === 2 && col === 2) || // 5x5, центр
                (level === 5 && row === 3 && col === 3);   // 7x7, центр
            
            if (isCenterCell) {
                // Пустая ячейка для красной точки
                cellsHTML += `<div class="schulte-cell empty"></div>`;
            } else if (cellIndex < totalCells) {
                // Ячейка с числом
                cellsHTML += `
                    <div class="schulte-cell" onclick="schulteCheckNumber(this, ${numbers[cellIndex]})">
                        ${numbers[cellIndex]}
                    </div>
                `;
                cellIndex++;
            }
        }
    }
    
    // Для уровня 2 и 4 просто создаем все ячейки с увеличенными отступами
    if (level === 2 || level === 4) {
        cellsHTML = '';
        numbers.forEach(num => {
            cellsHTML += `
                <div class="schulte-cell" onclick="schulteCheckNumber(this, ${num})">
                    ${num}
                </div>
            `;
        });
    }
    
    gameContainer.innerHTML = `
        <div class="schulte-instruction-wrapper">
            <div class="schulte-instruction">${instructionText}</div>
        </div>
        <div class="schulte-container">
            <div class="schulte-table" style="
                grid-template-columns: repeat(${gridSize}, ${cellSize}px);
                gap: ${gapSize}px;
                padding: ${tablePadding}px;">
                ${cellsHTML}
            </div>
            <div class="schulte-center"></div>
        </div>
        <div class="schulte-controls-bottom">
            <button class="control-btn reset" onclick="startSchulteGame(${level})">Начать заново</button>
        </div>
    `;
 
    window.schulteGameState = {
        currentNumber: 1,
        totalNumbers: totalCells
    };
}
 
function schulteCheckNumber(cell, number) {
    const gameState = window.schulteGameState;
    
    if (number === gameState.currentNumber) {
        cell.classList.add('current');
        gameState.currentNumber++;
        
        if (gameState.currentNumber > gameState.totalNumbers) {
            setTimeout(() => showNotification('Вы успешно нашли все числа по порядку! Уровень пройден!'), 500);
        }
    } else {
        cell.classList.add('wrong');
        setTimeout(() => cell.classList.remove('wrong'), 500);
    }
}

// ==========================================
// ИГРА: ПАЗЛЫ (ИСПРАВЛЕННАЯ ВЕРСИЯ)
// ==========================================
function startPuzzleGame(size) {
    removePuzzleButtons(); // Удаляем старые кнопки если есть
    
    const gameContainer = document.getElementById('gameContainer');
    
    // Выбираем случайное изображение из вашего массива
    const randomIndex = Math.floor(Math.random() * puzzleImages.length);
    const imageUrl = puzzleImages[randomIndex];
    
    // Сохраняем текущее изображение и размер
    currentPuzzleImageUrl = imageUrl;
    currentPuzzleSize = size;
    
    gameContainer.innerHTML = `
        <h2 class="puzzle-title">Соберите изображение, перетаскивая кусочки пазла в ячейки на поле.</h2>
        <div class="puzzle-container">
            <div class="puzzle-area">
                <div class="puzzle-board" id="puzzleBoard"></div>
                <div class="puzzle-pieces-container" id="puzzlePieces"></div>
            </div>
        </div>
    `;
    
    // Создаем кнопки в правом верхнем углу
    createPuzzleButtons(size);
    
    createPuzzleWithImages(size, imageUrl);
}

// Функция для создания кнопок пазлов в правом верхнем углу
function createPuzzleButtons(size) {
    // Удаляем старые кнопки если есть
    removePuzzleButtons();
    
    // Создаем кнопку "Начать заново"
    const resetButton = document.createElement('button');
    resetButton.id = 'puzzleResetButton';
    resetButton.className = 'puzzle-reset-btn';
    resetButton.textContent = 'Начать заново';
    resetButton.onclick = () => startPuzzleGame(size);
    
    // Создаем кнопку "Показать картинку"
    const showImageButton = document.createElement('button');
    showImageButton.id = 'puzzleShowImageButton';
    showImageButton.className = 'puzzle-show-image-btn';
    showImageButton.textContent = 'Показать картинку';
    showImageButton.onclick = showPuzzleImage;
    
    // Добавляем кнопки в body
    document.body.appendChild(resetButton);
    document.body.appendChild(showImageButton);
}

// Функция для показа полного изображения пазла
function showPuzzleImage() {
    if (!currentPuzzleImageUrl) return;
    
    // Скрываем игровой экран и кнопки навигации
    document.getElementById('gameContainer').classList.remove('active');
    document.getElementById('homeButton').classList.remove('active');
    document.getElementById('levelSelectButton').classList.remove('active');
    
    // Скрываем кнопки пазлов
    const resetButton = document.getElementById('puzzleResetButton');
    const showImageButton = document.getElementById('puzzleShowImageButton');
    if (resetButton) resetButton.style.display = 'none';
    if (showImageButton) showImageButton.style.display = 'none';
    
    // Показываем экран с изображением
    document.getElementById('puzzleImageScreen').classList.add('active');
    
    // Показываем кнопку возврата
    const backToPuzzleBtn = document.getElementById('backToPuzzleButton');
    if (backToPuzzleBtn) {
        backToPuzzleBtn.style.display = 'block';
    }
    
    // Устанавливаем изображение
    const fullImage = document.getElementById('fullPuzzleImage');
    fullImage.src = currentPuzzleImageUrl;
    fullImage.alt = 'Полное изображение пазла';
    
    // Скрываем уведомление если открыто
    hideNotification();
}

// Функция для скрытия полного изображения пазла
function hidePuzzleImage() {
    // Скрываем экран с изображением
    document.getElementById('puzzleImageScreen').classList.remove('active');
    
    // Скрываем кнопку возврата
    const backToPuzzleBtn = document.getElementById('backToPuzzleButton');
    if (backToPuzzleBtn) {
        backToPuzzleBtn.style.display = 'none';
    }
    
    // Показываем игровой экран
    document.getElementById('gameContainer').classList.add('active');
    
    // Показываем кнопки навигации
    document.getElementById('homeButton').classList.add('active');
    document.getElementById('levelSelectButton').classList.add('active');
    
    // Показываем кнопки пазлов
    const resetButton = document.getElementById('puzzleResetButton');
    const showImageButton = document.getElementById('puzzleShowImageButton');
    if (resetButton) resetButton.style.display = 'block';
    if (showImageButton) showImageButton.style.display = 'block';
}

function createPuzzleWithImages(size, imageUrl) {
    const board = document.getElementById('puzzleBoard');
    const piecesContainer = document.getElementById('puzzlePieces');

    board.innerHTML = '';
    piecesContainer.innerHTML = '';

    const boardSize = 600;
    const pieceSize = boardSize / size;

    board.style.width = `${boardSize}px`;
    board.style.height = `${boardSize}px`;
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    // Создание пустых слотов для пазла
    for (let i = 0; i < size * size; i++) {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.dataset.index = i;
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('dragenter', dragEnter);
        slot.addEventListener('dragleave', dragLeave);
        slot.addEventListener('drop', dragDrop);
        board.appendChild(slot);
    }

    // Создание самих кусочков пазла
    const pieces = [];
    for (let i = 0; i < size * size; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.draggable = true;
        piece.dataset.originalIndex = i;

        const row = Math.floor(i / size);
        const col = i % size;

        piece.style.width = `${pieceSize}px`;
        piece.style.height = `${pieceSize}px`;
        piece.style.backgroundImage = `url('${imageUrl}')`;
        piece.style.backgroundSize = `${boardSize}px ${boardSize}px`;
        piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;

        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragend', dragEnd);
        pieces.push(piece);
    }

    // Перемешиваем кусочки и добавляем их в контейнер
    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(piece => piecesContainer.appendChild(piece));
}
 
// Функции Drag-and-Drop
function dragStart(e) {
    draggedPiece = this;
    setTimeout(() => this.classList.add('hide'), 0);
}
 
function dragEnd() {
    this.classList.remove('hide');
    draggedPiece = null;
}
 
function dragOver(e) {
    e.preventDefault();
}
 
function dragEnter(e) {
    e.preventDefault();
    this.classList.add('hovered');
}
 
function dragLeave() {
    this.classList.remove('hovered');
}
 
function dragDrop() {
    this.classList.remove('hovered');
    
    // Если в слоте уже есть кусок
    if (this.children.length > 0) {
        const existingPiece = this.children[0];
        // Если тащим из другого слота - меняем местами
        if (draggedPiece.parentElement.classList.contains('puzzle-slot')) {
            draggedPiece.parentElement.appendChild(existingPiece);
        } else {
            // Если тащим из банка - возвращаем старый в банк
            document.getElementById('puzzlePieces').appendChild(existingPiece);
        }
    }
    this.appendChild(draggedPiece);
    checkPuzzleComplete();
}
 
function checkPuzzleComplete() {
    const slots = document.querySelectorAll('.puzzle-slot');
    let isComplete = true;
    
    slots.forEach(slot => {
        if (slot.children.length === 0) {
            isComplete = false;
            return;
        }
        const piece = slot.children[0];
        if (slot.dataset.index !== piece.dataset.originalIndex) {
            isComplete = false;
        }
    });
    
    if (isComplete) {
        setTimeout(() => {
            document.querySelectorAll('.puzzle-piece').forEach(p => p.classList.add('correct'));
            showNotification('Вы успешно собрали пазл! Отличная работа!');
        }, 300);
    }
}
 
// ==========================================
// ИГРА: МАТРИЦА (ОБНОВЛЁННАЯ)
// ==========================================
function startMatrixGame(cellCount) {
    const gameContainer = document.getElementById('gameContainer');
    
    gameContainer.innerHTML = `
        <h2 class="matrix-instruction">Запомните расположение подсвеченных клеток, затем нажмите "Готово" и восстановите матрицу</h2>
        <div class="matrix-container">
            <div class="matrix-game" id="matrixGame"></div>
            <div class="matrix-controls-center">
                <button class="control-btn matrix-ready-btn" id="readyBtn" onclick="matrixHidePattern()">Готово</button>
                <button class="control-btn reset" onclick="startMatrixGame(${cellCount})">Начать заново</button>
            </div>
        </div>
    `;
 
    createMatrix(cellCount);
}
 
function createMatrix(cellCount) {
    const matrix = document.getElementById('matrixGame');
    matrix.innerHTML = '';
    
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        cell.dataset.index = i;
        matrix.appendChild(cell);
    }
 
    const highlightedCells = [];
    const availableCells = Array.from({length: 16}, (_, i) => i);
    
    for (let i = 0; i < cellCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        highlightedCells.push(availableCells.splice(randomIndex, 1)[0]);
    }
 
    highlightedCells.forEach(index => {
        matrix.children[index].classList.add('highlighted');
    });
 
    window.matrixGameState = {
        highlightedCells: highlightedCells,
        selectedCells: [],
        phase: 'memorization'
    };
}
 
function matrixHidePattern() {
    const gameState = window.matrixGameState;
    if (gameState.phase !== 'memorization') return; 
    
    const matrix = document.getElementById('matrixGame');
    const readyBtn = document.getElementById('readyBtn');
    
    gameState.highlightedCells.forEach(index => {
        matrix.children[index].classList.remove('highlighted');
    });
 
    readyBtn.textContent = 'Проверить';
    readyBtn.onclick = () => matrixCheckSolution();
 
    Array.from(matrix.children).forEach(cell => {
        cell.onclick = () => matrixToggleCell(cell);
    });
 
    gameState.phase = 'recall';
}
 
function matrixToggleCell(cell) {
    const gameState = window.matrixGameState;
    
    if (gameState.phase !== 'recall') return;
 
    const index = parseInt(cell.dataset.index);
    if (cell.classList.contains('selected')) {
        cell.classList.remove('selected');
        gameState.selectedCells = gameState.selectedCells.filter(i => i !== index);
    } else {
        cell.classList.add('selected');
        gameState.selectedCells.push(index);
    }
}
 
function matrixCheckSolution() {
    const gameState = window.matrixGameState;
    
    const isCorrect = gameState.highlightedCells.length === gameState.selectedCells.length &&
                     gameState.highlightedCells.every(cell => gameState.selectedCells.includes(cell));
 
    if (isCorrect) {
        showNotification('Вы правильно восстановили матрицу! Отличная память!');
    } else {
        showNotification('К сожалению, есть ошибки. Попробуйте еще раз.', 'error');
    }
 
    gameState.highlightedCells.forEach(index => {
        document.getElementById('matrixGame').children[index].classList.add('highlighted');
    });
 
    gameState.phase = 'finished';
}
 
// Обработчик для возврата кусочков в контейнер
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('puzzle-pieces-container')) {
            if (draggedPiece) {
                document.getElementById('puzzlePieces').appendChild(draggedPiece);
            }
        }
    });
});

// Запуск
showMainMenu();