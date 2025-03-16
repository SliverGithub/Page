let isTemplateWindowOpen = false;
let isAboutMeOpen = false;
let minimizedWindows = {};
let zIndexCounter = 1;

function makeDraggable(element) {
    const header = element.querySelector('.header');
    let isDragging = false;

    function handleDragStart(e) {
        if (element.classList.contains('maximized')) return; // Prevent dragging if maximized
        if (e.target.closest('.WindowButton')) return;
        e.preventDefault();
        isDragging = true;

        const event = e.type === 'mousedown' ? e : e.touches[0];
        const rect = element.getBoundingClientRect();
        const shiftX = event.clientX - rect.left;
        const shiftY = event.clientY - rect.top;

        function moveAt(clientX, clientY) {
            let newX = clientX - shiftX;
            let newY = clientY - shiftY;

            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;

            newX = Math.min(Math.max(0, newX), maxX);
            newY = Math.min(Math.max(0, newY), maxY);

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        }

        function onMove(e) {
            if (!isDragging) return;
            const pos = e.type.includes('mouse') ? e : e.touches[0];
            moveAt(pos.clientX, pos.clientY);
        }

        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });

        function stopDragging() {
            isDragging = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
        }

        document.addEventListener('mouseup', stopDragging, { once: true });
        document.addEventListener('touchend', stopDragging, { once: true });
    }

    header.addEventListener('mousedown', handleDragStart);
    header.addEventListener('touchstart', handleDragStart);

    element.addEventListener('mousedown', () => bringToFront(element));
}

function bringToFront(element) {
    element.style.zIndex = ++zIndexCounter;
}

document.addEventListener('DOMContentLoaded', () => {
    const existingWindows = document.querySelectorAll('.draggable');
    existingWindows.forEach(makeDraggable);
});

function closeWindow(button) {
    const windowToClose = button.closest('.draggable');
    const dock = document.querySelector('.dock');
    if (windowToClose) {
        if (windowToClose.classList.contains('maximized')) {
            dock.classList.remove('hidden');
        }
        if (windowToClose.id === 'template-window') {
            isTemplateWindowOpen = false;
            document.querySelector('[onclick="openTemplate()"]').classList.remove('active');
        }
        if (windowToClose.id === 'aboutme-window') {
            isAboutMeOpen = false;
            document.querySelector('[onclick="openAboutMe()"]').classList.remove('active');
        }
        windowToClose.remove();
    }
}

function minimizeWindow(button) {
    const windowToMinimize = button.closest('.draggable');
    const dock = document.querySelector('.dock');
    if (windowToMinimize) {
        if (windowToMinimize.classList.contains('maximized')) {
            dock.classList.remove('hidden');
            windowToMinimize.classList.remove('maximized');
            windowToMinimize.style.width = '';
            windowToMinimize.style.height = '';
            windowToMinimize.style.top = '';
            windowToMinimize.style.left = '';
        }
        windowToMinimize.style.display = 'none';
        minimizedWindows[windowToMinimize.id] = windowToMinimize;
    }
}

function restoreWindow(windowId) {
    const windowToRestore = minimizedWindows[windowId];
    if (windowToRestore) {
        windowToRestore.style.display = 'block';
        bringToFront(windowToRestore);
        delete minimizedWindows[windowId];
    }
}

function openTemplate() {
    if (isTemplateWindowOpen) {
        restoreWindow('template-window');
        return;
    }

    document.querySelector('[onclick="openTemplate()"]').classList.add('active');

    const newWindow = document.createElement('div');
    newWindow.className = 'draggable';
    newWindow.id = 'template-window';
    newWindow.innerHTML = `
        <div class="header">
            <button class="WindowButton resize" onclick="toggleResize(this)">
            <button class="WindowButton minimize" onclick="minimizeWindow(this)">
            <button class="WindowButton" onclick="closeWindow(this)">
        </div>
        <div class="content">
            Insert content here
        </div>
    `;
    document.body.appendChild(newWindow);
    makeDraggable(newWindow);
    bringToFront(newWindow);
    isTemplateWindowOpen = true;
}

function openPython() {
    if (isPythonOpen) {
        restoreWindow('python-window');
        return;
    }

    document.querySelector('[onclick="openPython()"]').classList.add('active');

    const newWindow = document.createElement('div');
    newWindow.className = 'draggable';
    newWindow.id = 'python-window';
    newWindow.innerHTML = `
        <div class="header">
            <button class="WindowButton resize" onclick="toggleResize(this)">
            <button class="WindowButton minimize" onclick="minimizeWindow(this)">
            <button class="WindowButton" onclick="closeWindow(this)">
        </div>
        <div class="content">
            <iframe src="https://trinket.io/embed/python/daea98fc8a6d?toggleCode=true" width="100%" height="356" frameborder="0" marginwidth="0" marginheight="0" allowfullscreen></iframe>
        </div>
    `;
    document.body.appendChild(newWindow);
    makeDraggable(newWindow);
    bringToFront(newWindow);
    isPythonWindowOpen = true;
}

function toggleResize(button) {
    const window = button.closest('.draggable');
    const dock = document.querySelector('.dock');
    if (window.classList.contains('maximized')) {
        window.style.width = '';
        window.style.height = '';
        window.style.top = '';
        window.style.left = '';
        window.classList.remove('maximized');
        dock.classList.remove('hidden');
    } else {
        window.style.width = '100vw';
        window.style.height = '100vh';
        window.style.top = '0';
        window.style.left = '0';
        window.classList.add('maximized');
        dock.classList.add('hidden');
    }
}