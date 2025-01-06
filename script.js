let isTemplateWindowOpen = false;

function makeDraggable(element) {
    const header = element.querySelector('.header');
    let isDragging = false;
    
    // Mouse Events
    header.onmousedown = handleDragStart;
    // Touch Events
    header.ontouchstart = handleDragStart;

    function handleDragStart(e) {
        if (e.target.closest('.WindowButton')) return;
        e.preventDefault();
        isDragging = true;

        const event = e.type === 'mousedown' ? e : e.touches[0];
        const rect = element.getBoundingClientRect();
        const shiftX = event.clientX - rect.left;
        const shiftY = event.clientY - rect.top;

        element.style.position = 'absolute';
        
        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + 'px';
            element.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchmove', onMouseMove);
        document.onmouseup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchmove', onMouseMove);
            document.onmouseup = null;
            isDragging = false;
        };
        document.ontouchend = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('touchmove', onMouseMove);
            document.ontouchend = null;
            isDragging = false;
        };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const existingWindows = document.querySelectorAll('.draggable');
    existingWindows.forEach(makeDraggable);
});

function closeWindow(button) {
    const windowToClose = button.closest('.draggable');
    if (windowToClose) {
        if (windowToClose.id === 'github-window') {
            isGithubWindowOpen = false;
        }
        if (windowToClose.id === 'steam-window') {
            isSteamWindowOpen = false;
        }
        windowToClose.remove();
    }
}

function openTemplate() {
    if (isTemplateWindowOpen) return;
    
    const newWindow = document.createElement('div');
    newWindow.className = 'draggable';
    newWindow.id = 'template-window';
    newWindow.innerHTML = `
        <div class="header">
            <button class="WindowButton" onclick="closeWindow(this)">
                <i class="fa-solid fa-x" style="color:red;"></i>
            </button>
        </div>
        <div class="content">
            insert content here
        </div>
    `;
    document.body.appendChild(newWindow);
    makeDraggable(newWindow);
    isTemplateWindowOpen = true;
}