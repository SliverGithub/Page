let isGithubWindowOpen = false;
let isTemplateWindowOpen = false;

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    window.location.href = 'https://www.google.com';

}

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

function openGithub() {
    if (isGithubWindowOpen) return;
    
    const newWindow = document.createElement('div');
    newWindow.className = 'draggable';
    newWindow.id = 'github-window';
    newWindow.innerHTML = `
        <div class="header">
            <button class="WindowButton" onclick="closeWindow(this)">
                <i class="fa-solid fa-x" style="color:red;"></i>
            </button>
        </div>
        <div class="content">
            <div class="calendar"></div>
        </div>
    `;
    document.body.appendChild(newWindow);
    makeDraggable(newWindow);
    new GitHubCalendar(".calendar", "SliverGithub");
    isGithubWindowOpen = true;
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