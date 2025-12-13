// =============================================================================
// КОНФИГУРАЦИЯ И ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// =============================================================================

const puzzleImages = [  // Массив изображений для пазлов
    'puz1.jpg', 'puz2.jpg', 'puz3.jpg', 'puz4.jpg', 'puz5.jpg',
    'puz6.jpg', 'puz7.jpg', 'puz8.jpg', 'puz9.jpg', 'puz10.jpg',
    'puz11.jpg', 'puz12.jpg', 'puz13.jpg', 'puz14.jpg', 'puz15.jpg',
    'puz16.jpg', 'puz17.jpg', 'puz18.jpg', 'puz19.jpg', 'puz20.jpg',
    'puz21.jpg', 'puz22.jpg', 'puz23.jpg', 'puz24.jpg', 'puz25.jpg',
    'puz26.jpg'
];

let currentGame = '';               // Текущая выбранная игра
let draggedPiece = null;            // Перетаскиваемый элемент пазла
let currentPuzzleImageUrl = '';     // URL текущего изображения пазла
let currentPuzzleSize = 0;          // Размер текущего пазла (NxN)

// =============================================================================
// СИСТЕМА УВЕДОМЛЕНИЙ И ПОЗДРАВЛЕНИЙ
// =============================================================================

function showNotification(message, type = 'success') {
    const overlay = document.getElementById('notificationOverlay');
    const messageElement = document.getElementById('notificationMessage');
    
    messageElement.textContent = message; // Устанавливаем текст сообщения
    
    // Настраиваем внешний вид в зависимости от типа уведомления
    if (type === 'error') {
        document.querySelector('.notification-box').style.background = 'linear-gradient(135deg, #ff6b6b 0%, #c44569 100%)';
        document.querySelector('.notification-header h3').textContent = '⚠️ Ошибка!';
    } else {
        document.querySelector('.notification-box').style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        document.querySelector('.notification-header h3').textContent = '🎉 Поздравляем!';
    }
    
    overlay.classList.add('active'); // Показываем уведомление
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        if (overlay.classList.contains('active')) hideNotification();
    }, 5000);
}

function hideNotification() {
    document.getElementById('notificationOverlay').classList.remove('active'); // Скрываем уведомление
}

// Закрытие уведомления по клавише ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') hideNotification();
});

// Закрытие уведомления при клике на фон
document.getElementById('notificationOverlay').addEventListener('click', function(e) {
    if (e.target === this) hideNotification();
});

// =============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ УПРАВЛЕНИЯ ИНТЕРФЕЙСОМ
// =============================================================================

function removePuzzleButtons() {
    // Удаляем кнопки управления пазлами, если они существуют
    const puzzleResetBtn = document.getElementById('puzzleResetButton');
    const puzzleShowImageBtn = document.getElementById('puzzleShowImageButton');
    if (puzzleResetBtn) puzzleResetBtn.remove();
    if (puzzleShowImageBtn) puzzleShowImageBtn.remove();
}

function showMainMenu() {
    removePuzzleButtons(); // Очищаем кнопки пазлов
    
    // Показываем главное меню, скрываем остальные экраны
    document.getElementById('mainMenu').classList.add('active');
    document.getElementById('gameContainer').classList.remove('active');
    document.getElementById('puzzleImageScreen').classList.remove('active');
    document.getElementById('gameContainer').innerHTML = '';
    
    // Скрываем навигационные кнопки
    document.getElementById('homeButton').classList.remove('active');
    document.getElementById('levelSelectButton').classList.remove('active');
    
    // Скрываем кнопку возврата с экрана изображения
    const backToPuzzleBtn = document.getElementById('backToPuzzleButton');
    if (backToPuzzleBtn) backToPuzzleBtn.style.display = 'none';
    
    hideNotification(); // Закрываем открытые уведомления
}

function showGame(gameName) {
    removePuzzleButtons(); // Очищаем кнопки пазлов
    currentGame = gameName; // Сохраняем текущую игру
    
    // Переключаем видимость экранов
    document.getElementById('mainMenu').classList.remove('active');
    document.getElementById('gameContainer').classList.add('active');
    document.getElementById('puzzleImageScreen').classList.remove('active');
    
    // Показываем кнопку "Главное меню", скрываем "Выбор уровня"
    document.getElementById('homeButton').classList.add('active');
    document.getElementById('levelSelectButton').classList.remove('active');
    
    // Очищаем и показываем выбор уровня для выбранной игры
    document.getElementById('gameContainer').innerHTML = '';
    showLevelSelection(gameName);
    
    // Скрываем кнопку возврата с экрана изображения
    const backToPuzzleBtn = document.getElementById('backToPuzzleButton');
    if (backToPuzzleBtn) backToPuzzleBtn.style.display = 'none';
    
    hideNotification(); // Закрываем открытые уведомления
}

function showLevelSelectionForCurrentGame() {
    if (currentGame) showLevelSelection(currentGame); // Показываем выбор уровня для текущей игры
}

function showLevelSelection(gameName) {
    removePuzzleButtons(); // Очищаем кнопки пазлов
    
    const gameContainer = document.getElementById('gameContainer');
    let levels = [], levelLabels = [], gameTitle = '';
    
    // Конфигурация уровней для каждой игры
    switch(gameName) {
        case 'memory':  // Игра "Карточки"
            gameTitle = 'Карточки';
            levels = [4, 6, 8, 10, 12];
            levelLabels = ['Уровень 1 (4 пары)', 'Уровень 2 (6 пар)', 'Уровень 3 (8 пар)', 'Уровень 4 (10 пар)', 'Уровень 5 (12 пар)'];
            break;
        case 'puzzle':  // Игра "Пазлы"
            gameTitle = 'Пазлы';
            levels = [3, 4, 5, 6, 7];
            levelLabels = ['Уровень 1 (3x3)', 'Уровень 2 (4x4)', 'Уровень 3 (5x5)', 'Уровень 4 (6x6)', 'Уровень 5 (7x7)'];
            break;
        case 'schulte': // Игра "Таблица Шульте"
            gameTitle = 'Таблица Шульте';
            levels = [1, 2, 3, 4, 5];
            levelLabels = ['Уровень 1 (8 чисел)', 'Уровень 2 (16 чисел)', 'Уровень 3 (24 числа)', 'Уровень 4 (36 чисел)', 'Уровень 5 (48 чисел)'];
            break;
        case 'matrix':  // Игра "Матрица"
            gameTitle = 'Матрица';
            levels = [4, 5, 6, 7, 8];
            levelLabels = ['Уровень 1 (4 клетки)', 'Уровень 2 (5 клеток)', 'Уровень 3 (6 клеток)', 'Уровень 4 (7 клеток)', 'Уровень 5 (8 клеток)'];
            break;
    }
    
    // Генерация HTML для кнопок уровней
    let levelsHTML = '';
    for (let i = 0; i < levels.length; i++) {
        levelsHTML += `<button class="level-btn" onclick="startGame('${gameName}', ${levels[i]})">${levelLabels[i]}</button>`;
    }
    
    // Отображение экрана выбора уровня
    gameContainer.innerHTML = `
        <h2>${gameTitle} - Выбор уровня</h2>
        <div class="level-selector">${levelsHTML}</div>
    `;
    
    document.getElementById('levelSelectButton').classList.remove('active'); // Скрываем кнопку выбора уровня
    hideNotification(); // Закрываем открытые уведомления
}

function startGame(gameName, level) {
    removePuzzleButtons(); // Очищаем кнопки пазлов
    
    // Показываем обе навигационные кнопки
    document.getElementById('homeButton').classList.add('active');
    document.getElementById('levelSelectButton').classList.add('active');
    
    // Запускаем соответствующую игру с выбранным уровнем
    switch(gameName) {
        case 'memory': startMemoryGame(level); break;
        case 'puzzle': startPuzzleGame(level); break;
        case 'schulte': startSchulteGame(level); break;
        case 'matrix': startMatrixGame(level); break;
    }
    
    hideNotification(); // Закрываем открытые уведомления
}

// =============================================================================
// ИГРА "КАРТОЧКИ"
// =============================================================================

function startMemoryGame(pairs) {
    const animals = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐸', '🐵', '🐤', '🦄', '🐞']; // Доступные эмодзи
    const selectedAnimals = animals.slice(0, pairs); 
    const cards = [...selectedAnimals, ...selectedAnimals]; // Создаем пары карточек
    
    // Перемешиваем карточки (алгоритм Фишера-Йетса)
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    // Определяем количество колонок в сетке в зависимости от количества пар
    let gridColumns = 4;
    if (pairs === 10) gridColumns = 5;
    else if (pairs === 12) gridColumns = 6;
    
    const pairsWord = (pairs === 4) ? "пары" : "пар"; // Правильное склонение слова
    const gameContainer = document.getElementById('gameContainer');
    
    // Генерация HTML для карточек
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
    
    // Отображение игрового поля
    gameContainer.innerHTML = `
        <h2>Найдите ${pairs} ${pairsWord} карточек</h2>
        <div class="memory-game" style="grid-template-columns: repeat(${gridColumns}, 100px);">
            ${cardsHTML}
        </div>
        <div class="memory-controls-bottom">
            <button class="control-btn reset" onclick="startMemoryGame(${pairs})">Начать заново</button>
        </div>
    `;
    
    // Инициализация состояния игры
    window.memoryGameState = {
        cards: cards,
        flippedCards: [],      // Перевернутые карточки в текущем ходе
        matchedPairs: 0,       // Количество найденных пар
        totalPairs: pairs      // Общее количество пар
    };
}

function memoryFlipCard(cardElement, index) {
    const gameState = window.memoryGameState;
    
    // Если уже перевернуто 2 карточки или эта уже перевернута - выходим
    if (gameState.flippedCards.length === 2 || cardElement.classList.contains('flipped')) return;
    
    cardElement.classList.add('flipped'); // Переворачиваем карточку
    gameState.flippedCards.push({ element: cardElement, index }); // Сохраняем в состоянии
    
    if (gameState.flippedCards.length === 2) {
        setTimeout(() => memoryCheckMatch(), 500); // Проверяем совпадение через 0.5с
    }
}

function memoryCheckMatch() {
    const gameState = window.memoryGameState;
    const [card1, card2] = gameState.flippedCards;
    const isMatch = gameState.cards[card1.index] === gameState.cards[card2.index]; // Проверяем совпадение
    
    if (isMatch) { // Если карточки совпали
        gameState.matchedPairs++;
        gameState.flippedCards = [];
        
        if (gameState.matchedPairs === gameState.totalPairs) { // Если все пары найдены
            setTimeout(() => showNotification('Вы успешно собрали все пары карточек! Уровень пройден!'), 300);
        }
    } else { // Если карточки не совпали
        card1.element.classList.add('wrong');
        card2.element.classList.add('wrong');
        
        setTimeout(() => { // Через 1 секунду переворачиваем обратно
            card1.element.classList.remove('flipped', 'wrong');
            card2.element.classList.remove('flipped', 'wrong');
            gameState.flippedCards = [];
        }, 1000);
    }
}

// =============================================================================
// ИГРА "ТАБЛИЦА ШУЛЬТЕ"
// =============================================================================

function startSchulteGame(level) {
    let totalCells, instructionText, gridSize, cellSize, gapSize, tablePadding;
    
    // Конфигурация параметров для каждого уровня сложности
    switch(level) {
        case 1: // Уровень 1: 8 чисел (3x3 с пустым центром)
            totalCells = 8; instructionText = "Сосредоточьтесь на красной точке и находите числа по порядку от 1 до 8";
            gridSize = 3; cellSize = 90; gapSize = 20; tablePadding = 30; break;
        case 2: // Уровень 2: 16 чисел (4x4 с увеличенными отступами)
            totalCells = 16; instructionText = "Сосредоточьтесь на красной точке и находите числа по порядку от 1 до 16";
            gridSize = 4; cellSize = 70; gapSize = 20; tablePadding = 45; break;
        case 3: // Уровень 3: 24 числа (5x5 с пустым центром)
            totalCells = 24; instructionText = "Сосредоточьтесь на красной точке и находите числа по порядку от 1 до 24";
            gridSize = 5; cellSize = 70; gapSize = 15; tablePadding = 30; break;
        case 4: // Уровень 4: 36 чисел (6x6 с увеличенными отступами)
            totalCells = 36; instructionText = "Сосредоточьтесь на красной точке и находите числа по порядку от 1 до 36";
            gridSize = 6; cellSize = 50; gapSize = 20; tablePadding = 40; break;
        case 5: // Уровень 5: 48 чисел (7x7 с пустым центром)
            totalCells = 48; instructionText = "Сосредоточьтесь на красной точке и находите числа по порядку от 1 до 48";
            gridSize = 7; cellSize = 50; gapSize = 15; tablePadding = 30; break;
        default: // Значения по умолчанию
            totalCells = 16; instructionText = "Сосредоточьтесь на красной точке и находите числа по порядку";
            gridSize = 4; cellSize = 90; gapSize = 20; tablePadding = 30;
    }
    
    const numbers = Array.from({length: totalCells}, (_, i) => i + 1); // Создаем массив чисел
    
    // Перемешиваем числа
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    const gameContainer = document.getElementById('gameContainer');
    let cellsHTML = '';
    let cellIndex = 0;
    
    // Генерация ячеек таблицы с учетом пустого центра для некоторых уровней
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const isCenterCell = (level === 1 && row === 1 && col === 1) || // 3x3 центр
                                (level === 3 && row === 2 && col === 2) || // 5x5 центр
                                (level === 5 && row === 3 && col === 3);   // 7x7 центр
            
            if (isCenterCell) {
                cellsHTML += `<div class="schulte-cell empty"></div>`; // Пустая ячейка для красной точки
            } else if (cellIndex < totalCells) {
                cellsHTML += `<div class="schulte-cell" onclick="schulteCheckNumber(this, ${numbers[cellIndex]})">${numbers[cellIndex]}</div>`;
                cellIndex++;
            }
        }
    }
    
    // Для уровней 2 и 4 создаем обычную сетку
    if (level === 2 || level === 4) {
        cellsHTML = '';
        numbers.forEach(num => {
            cellsHTML += `<div class="schulte-cell" onclick="schulteCheckNumber(this, ${num})">${num}</div>`;
        });
    }
    
    // Отображение игрового поля
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
    
    // Инициализация состояния игры
    window.schulteGameState = {
        currentNumber: 1,      // Текущее искомое число
        totalNumbers: totalCells // Общее количество чисел
    };
}

function schulteCheckNumber(cell, number) {
    const gameState = window.schulteGameState;
    
    if (number === gameState.currentNumber) { // Если нажато правильное число
        cell.classList.add('current'); // Подсвечиваем ячейку
        gameState.currentNumber++; // Переходим к следующему числу
        
        if (gameState.currentNumber > gameState.totalNumbers) { // Если все числа найдены
            setTimeout(() => showNotification('Вы успешно нашли все числа по порядку! Уровень пройден!'), 500);
        }
    } else { // Если нажато неправильное число
        cell.classList.add('wrong');
        setTimeout(() => cell.classList.remove('wrong'), 500); // Мигание ошибкой
    }
}

// =============================================================================
// ИГРА "ПАЗЛЫ"
// =============================================================================

function startPuzzleGame(size) {
    removePuzzleButtons(); // Очищаем старые кнопки
    
    const gameContainer = document.getElementById('gameContainer');
    const randomIndex = Math.floor(Math.random() * puzzleImages.length); // Случайное изображение
    const imageUrl = puzzleImages[randomIndex];
    
    // Сохраняем текущие параметры пазла
    currentPuzzleImageUrl = imageUrl;
    currentPuzzleSize = size;
    
    // Отображение игрового поля
    gameContainer.innerHTML = `
        <h2 class="puzzle-title">Соберите изображение, перетаскивая кусочки пазла в ячейки на поле.</h2>
        <div class="puzzle-container">
            <div class="puzzle-area">
                <div class="puzzle-board" id="puzzleBoard"></div>
                <div class="puzzle-pieces-container" id="puzzlePieces"></div>
            </div>
        </div>
    `;
    
    createPuzzleButtons(size); // Создаем кнопки управления
    createPuzzleWithImages(size, imageUrl); // Создаем пазл
}

function createPuzzleButtons(size) {
    removePuzzleButtons(); // Удаляем старые кнопки
    
    // Кнопка "Начать заново" (правый верхний угол)
    const resetButton = document.createElement('button');
    resetButton.id = 'puzzleResetButton';
    resetButton.className = 'puzzle-reset-btn';
    resetButton.textContent = 'Начать заново';
    resetButton.onclick = () => startPuzzleGame(size);
    
    // Кнопка "Показать картинку" (под кнопкой "Начать заново")
    const showImageButton = document.createElement('button');
    showImageButton.id = 'puzzleShowImageButton';
    showImageButton.className = 'puzzle-show-image-btn';
    showImageButton.textContent = 'Показать картинку';
    showImageButton.onclick = showPuzzleImage;
    
    document.body.appendChild(resetButton);
    document.body.appendChild(showImageButton);
}

function showPuzzleImage() {
    if (!currentPuzzleImageUrl) return; // Если нет изображения - выходим
    
    // Скрываем игровой интерфейс
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
    document.getElementById('backToPuzzleButton').style.display = 'block';
    document.getElementById('fullPuzzleImage').src = currentPuzzleImageUrl;
    
    hideNotification(); // Закрываем уведомления
}

function hidePuzzleImage() {
    // Восстанавливаем игровой интерфейс
    document.getElementById('puzzleImageScreen').classList.remove('active');
    document.getElementById('backToPuzzleButton').style.display = 'none';
    document.getElementById('gameContainer').classList.add('active');
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
    const boardSize = 600;
    const pieceSize = boardSize / size;

    board.innerHTML = ''; // Очищаем доску
    piecesContainer.innerHTML = ''; // Очищаем контейнер с кусочками
    
    // Настройка игрового поля
    board.style.width = `${boardSize}px`;
    board.style.height = `${boardSize}px`;
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    // Создание пустых слотов для пазла
    for (let i = 0; i < size * size; i++) {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.dataset.index = i;
        // Добавляем обработчики событий Drag-and-Drop
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('dragenter', dragEnter);
        slot.addEventListener('dragleave', dragLeave);
        slot.addEventListener('drop', dragDrop);
        board.appendChild(slot);
    }

    // Создание кусочков пазла
    const pieces = [];
    for (let i = 0; i < size * size; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.draggable = true;
        piece.dataset.originalIndex = i;

        const row = Math.floor(i / size);
        const col = i % size;

        // Настройка фонового изображения для каждого кусочка
        piece.style.width = `${pieceSize}px`;
        piece.style.height = `${pieceSize}px`;
        piece.style.backgroundImage = `url('${imageUrl}')`;
        piece.style.backgroundSize = `${boardSize}px ${boardSize}px`;
        piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;

        piece.addEventListener('dragstart', dragStart);
        piece.addEventListener('dragend', dragEnd);
        pieces.push(piece);
    }

    // Перемешиваем и добавляем кусочки в контейнер
    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(piece => piecesContainer.appendChild(piece));
}

// =============================================================================
// DRAG-AND-DROP ФУНКЦИИ ДЛЯ ПАЗЛОВ
// =============================================================================

function dragStart(e) {
    draggedPiece = this; // Сохраняем перетаскиваемый элемент
    setTimeout(() => this.classList.add('hide'), 0); // Визуально скрываем
}

function dragEnd() {
    this.classList.remove('hide'); // Восстанавливаем видимость
    draggedPiece = null; // Сбрасываем перетаскиваемый элемент
}

function dragOver(e) {
    e.preventDefault(); // Разрешаем сброс
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add('hovered'); // Подсвечиваем слот при наведении
}

function dragLeave() {
    this.classList.remove('hovered'); // Убираем подсветку
}

function dragDrop() {
    this.classList.remove('hovered'); // Убираем подсветку
    
    // Если в слоте уже есть кусок
    if (this.children.length > 0) {
        const existingPiece = this.children[0];
        if (draggedPiece.parentElement.classList.contains('puzzle-slot')) {
            // Меняем кусочки местами
            draggedPiece.parentElement.appendChild(existingPiece);
        } else {
            // Возвращаем старый кусок в контейнер
            document.getElementById('puzzlePieces').appendChild(existingPiece);
        }
    }
    this.appendChild(draggedPiece); // Помещаем перетаскиваемый кусок в слот
    checkPuzzleComplete(); // Проверяем, собран ли пазл
}

function checkPuzzleComplete() {
    const slots = document.querySelectorAll('.puzzle-slot');
    let isComplete = true;
    
    // Проверяем, все ли кусочки на своих местах
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
    
    if (isComplete) { // Если пазл собран
        setTimeout(() => {
            document.querySelectorAll('.puzzle-piece').forEach(p => p.classList.add('correct'));
            showNotification('Вы успешно собрали пазл! Отличная работа!');
        }, 300);
    }
}

// Обработчик для возврата кусочков в контейнер при клике на него
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('puzzle-pieces-container') && draggedPiece) {
            document.getElementById('puzzlePieces').appendChild(draggedPiece);
        }
    });
});

// =============================================================================
// ИГРА "МАТРИЦА"
// =============================================================================

function startMatrixGame(cellCount) {
    const gameContainer = document.getElementById('gameContainer');
    
    // Отображение игрового интерфейса
    gameContainer.innerHTML = `
        <h2 class="matrix-instruction">Запомните расположение подсвеченных клеток,<br>
        затем нажмите "Готово" и восстановите матрицу</h2>
        <div class="matrix-container">
            <div class="matrix-game" id="matrixGame"></div>
            <div class="matrix-controls-center">
                <button class="control-btn matrix-ready-btn" id="readyBtn" onclick="matrixHidePattern()">Готово</button>
                <button class="control-btn reset" onclick="startMatrixGame(${cellCount})">Начать заново</button>
            </div>
        </div>
    `;
    
    createMatrix(cellCount); // Создаем матрицу
}

function createMatrix(cellCount) {
    const matrix = document.getElementById('matrixGame');
    matrix.innerHTML = '';
    
    // Создаем 16 клеток матрицы (4x4)
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'matrix-cell';
        cell.dataset.index = i;
        matrix.appendChild(cell);
    }
    
    // Выбираем случайные клетки для подсветки
    const highlightedCells = [];
    const availableCells = Array.from({length: 16}, (_, i) => i);
    
    for (let i = 0; i < cellCount; i++) {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        highlightedCells.push(availableCells.splice(randomIndex, 1)[0]);
    }
    
    // Подсвечиваем выбранные клетки
    highlightedCells.forEach(index => {
        matrix.children[index].classList.add('highlighted');
    });
    
    // Инициализация состояния игры
    window.matrixGameState = {
        highlightedCells: highlightedCells, // Подсвеченные клетки
        selectedCells: [],                  // Клетки, выбранные игроком
        phase: 'memorization'               // Фаза игры: запоминание или воспроизведение
    };
}

function matrixHidePattern() {
    const gameState = window.matrixGameState;
    if (gameState.phase !== 'memorization') return; // Если не фаза запоминания - выходим
    
    // Скрываем подсвеченные клетки
    const matrix = document.getElementById('matrixGame');
    const readyBtn = document.getElementById('readyBtn');
    
    gameState.highlightedCells.forEach(index => {
        matrix.children[index].classList.remove('highlighted');
    });
    
    // Меняем кнопку "Готово" на "Проверить"
    readyBtn.textContent = 'Проверить';
    readyBtn.onclick = () => matrixCheckSolution();
    
    // Включаем возможность выбора клеток
    Array.from(matrix.children).forEach(cell => {
        cell.onclick = () => matrixToggleCell(cell);
    });
    
    gameState.phase = 'recall'; // Переходим к фазе воспроизведения
}

function matrixToggleCell(cell) {
    const gameState = window.matrixGameState;
    if (gameState.phase !== 'recall') return; // Если не фаза воспроизведения - выходим
    
    const index = parseInt(cell.dataset.index);
    if (cell.classList.contains('selected')) {
        // Снимаем выделение
        cell.classList.remove('selected');
        gameState.selectedCells = gameState.selectedCells.filter(i => i !== index);
    } else {
        // Добавляем выделение
        cell.classList.add('selected');
        gameState.selectedCells.push(index);
    }
}

function matrixCheckSolution() {
    const gameState = window.matrixGameState;
    
    // Проверяем, совпадает ли выделение игрока с оригинальным
    const isCorrect = gameState.highlightedCells.length === gameState.selectedCells.length &&
                     gameState.highlightedCells.every(cell => gameState.selectedCells.includes(cell));
    
    // Показываем результат
    if (isCorrect) {
        showNotification('Вы правильно восстановили матрицу! Отличная память!');
    } else {
        showNotification('К сожалению, есть ошибки. Попробуйте еще раз.', 'error');
    }
    
    // Показываем правильный ответ
    gameState.highlightedCells.forEach(index => {
        document.getElementById('matrixGame').children[index].classList.add('highlighted');
    });
    
    gameState.phase = 'finished'; // Завершаем игру
}

// =============================================================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// =============================================================================

showMainMenu(); // Запускаем приложение с главного меню
