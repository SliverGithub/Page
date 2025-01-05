function makeDraggable(element) {
    const header = element.querySelector('.header');
    header.onmousedown = function(event) {
        if (event.target.closest('.WindowButton')) return;
        event.preventDefault();
        
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
        document.onmouseup = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    };
}

function openNewWindow() {
    const userHtml = prompt("Enter HTML content for the new window:");
    if (!userHtml) return;

    const newWindow = document.createElement('div');
    newWindow.className = 'draggable';
    newWindow.innerHTML = `
        <div class="header">
            <button class="WindowButton" onclick="closeWindow(this)">
                <i class="fa-solid fa-x" style="color:red;"></i>
            </button>
        </div>
        <div class="content">
            ${userHtml}
        </div>
    `;
    document.body.appendChild(newWindow);
    makeDraggable(newWindow);
}

document.addEventListener('DOMContentLoaded', () => {
    const existingWindows = document.querySelectorAll('.draggable');
    existingWindows.forEach(makeDraggable);
});

function closeWindow(button) {
    const windowToClose = button.closest('.draggable');
    if (windowToClose) {
        windowToClose.remove();
    }
}