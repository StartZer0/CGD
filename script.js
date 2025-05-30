// === Existing Topic Hierarchy Code ===
const addMainTopicBtn = document.getElementById('add-main-topic-btn');
const topicHierarchyContainer = document.getElementById('topic-hierarchy');

function addTopic(parentElement, level) {
    const name = prompt(`Enter name for ${level === 0 ? 'main topic' : 'subtopic'}:`);
    if (!name || name.trim() === "") {
        return;
    }
    const topicDiv = document.createElement('div');
    topicDiv.classList.add('topic', `topic-level-${level}`);
    const topicNameSpan = document.createElement('span');
    topicNameSpan.textContent = name;
    topicDiv.appendChild(topicNameSpan);
    const subtopicsContainer = document.createElement('div');
    subtopicsContainer.classList.add('subtopics-container');
    if (level < 2) {
        const addButton = document.createElement('button');
        addButton.textContent = 'Add Subtopic';
        addButton.classList.add('add-sub-topic-btn');
        addButton.addEventListener('click', (e) => {
            e.stopPropagation();
            addTopic(subtopicsContainer, level + 1);
        });
        topicDiv.appendChild(addButton);
    }
    topicDiv.appendChild(subtopicsContainer);
    parentElement.appendChild(topicDiv);
}

if (addMainTopicBtn) {
    addMainTopicBtn.addEventListener('click', () => {
        addTopic(topicHierarchyContainer, 0);
    });
} else {
    console.error("Button with ID 'add-main-topic-btn' not found.");
}

// === Existing Resizing and Toggling Code ===
const resizer = document.getElementById('resizer');
const leftPanel = document.getElementById('left-panel');
const rightPanel = document.getElementById('right-panel');
const mainContent = document.getElementById('main-content');
const toggleTopicsBtn = document.getElementById('toggle-topics-btn');
const toggleLeftPanelBtn = document.getElementById('toggle-left-panel-btn');
const toggleRightPanelBtn = document.getElementById('toggle-right-panel-btn');
let isResizing = false;
let initialClientX = 0;
let initialLeftPanelBasis = 0;
let initialRightPanelBasis = 0;
const minPanelWidth = 100;

if (resizer && leftPanel && rightPanel && mainContent) {
    resizer.addEventListener('mousedown', (e) => {
        e.preventDefault(); 
        isResizing = true;
        initialClientX = e.clientX;
        initialLeftPanelBasis = (leftPanel.style.flexBasis && leftPanel.style.flexBasis !== '0px') ? parseFloat(leftPanel.style.flexBasis) : leftPanel.offsetWidth;
        initialRightPanelBasis = (rightPanel.style.flexBasis && rightPanel.style.flexBasis !== '0px') ? parseFloat(rightPanel.style.flexBasis) : rightPanel.offsetWidth;
        if (!leftPanel.dataset.originalFlexBasis) {
            leftPanel.dataset.originalFlexBasis = initialLeftPanelBasis + 'px';
        }
        if (!rightPanel.dataset.originalFlexBasis) {
            rightPanel.dataset.originalFlexBasis = initialRightPanelBasis + 'px';
        }
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });

    function handleMouseMove(e) {
        if (!isResizing) return;
        const dx = e.clientX - initialClientX;
        let newLeftPanelBasis = initialLeftPanelBasis + dx;
        let newRightPanelBasis = initialRightPanelBasis - dx;
        const totalWidth = mainContent.offsetWidth - resizer.offsetWidth;
        if (newLeftPanelBasis < minPanelWidth) {
            newLeftPanelBasis = minPanelWidth;
            newRightPanelBasis = totalWidth - newLeftPanelBasis;
        } else if (newRightPanelBasis < minPanelWidth) {
            newRightPanelBasis = minPanelWidth;
            newLeftPanelBasis = totalWidth - newRightPanelBasis;
        }
        if (newLeftPanelBasis + newRightPanelBasis > totalWidth) {
            if (dx > 0) newRightPanelBasis = totalWidth - newLeftPanelBasis;
            else newLeftPanelBasis = totalWidth - newRightPanelBasis;
        }
        leftPanel.style.flexBasis = newLeftPanelBasis + 'px';
        rightPanel.style.flexBasis = newRightPanelBasis + 'px';
        leftPanel.style.flexGrow = '0'; rightPanel.style.flexGrow = '0';
        leftPanel.style.flexShrink = '0'; rightPanel.style.flexShrink = '0';
        leftPanel.dataset.originalFlexBasis = newLeftPanelBasis + 'px';
        rightPanel.dataset.originalFlexBasis = newRightPanelBasis + 'px';
    }

    function handleMouseUp() {
        if (!isResizing) return;
        isResizing = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
} else {
    console.error("One or more elements for resizing not found.");
}

if (toggleTopicsBtn && topicHierarchyContainer) {
    toggleTopicsBtn.addEventListener('click', () => topicHierarchyContainer.classList.toggle('hidden'));
}
if (toggleLeftPanelBtn && leftPanel) {
    toggleLeftPanelBtn.addEventListener('click', () => {
        const isHidden = leftPanel.classList.toggle('hidden');
        toggleLeftPanelBtn.textContent = isHidden ? 'Show' : 'Hide';
        checkResizerVisibility(); updatePanelLayouts();
    });
}
if (toggleRightPanelBtn && rightPanel) {
    toggleRightPanelBtn.addEventListener('click', () => {
        const isHidden = rightPanel.classList.toggle('hidden');
        toggleRightPanelBtn.textContent = isHidden ? 'Show' : 'Hide';
        checkResizerVisibility(); updatePanelLayouts();
    });
}

function checkResizerVisibility() {
    if (!resizer || !leftPanel || !rightPanel) return;
    const leftHidden = leftPanel.classList.contains('hidden');
    const rightHidden = rightPanel.classList.contains('hidden');
    resizer.classList.toggle('hidden', leftHidden || rightHidden);
}

function updatePanelLayouts() {
    if (!leftPanel || !rightPanel || !mainContent) return;
    const leftHidden = leftPanel.classList.contains('hidden');
    const rightHidden = rightPanel.classList.contains('hidden');
    leftPanel.style.flexGrow = '0'; leftPanel.style.flexShrink = '0';
    rightPanel.style.flexGrow = '0'; rightPanel.style.flexShrink = '0';
    if (leftHidden && !rightHidden) {
        rightPanel.style.flexBasis = '100%'; rightPanel.style.flexGrow = '1'; 
    } else if (!leftHidden && rightHidden) {
        leftPanel.style.flexBasis = '100%'; leftPanel.style.flexGrow = '1';
    } else if (!leftHidden && !rightHidden) {
        if (leftPanel.dataset.originalFlexBasis && rightPanel.dataset.originalFlexBasis) {
            leftPanel.style.flexBasis = leftPanel.dataset.originalFlexBasis;
            rightPanel.style.flexBasis = rightPanel.dataset.originalFlexBasis;
        } else {
            leftPanel.style.flexBasis = '0'; leftPanel.style.flexGrow = '1';
            rightPanel.style.flexBasis = '0'; rightPanel.style.flexGrow = '1';
        }
    }
}
checkResizerVisibility(); updatePanelLayouts(); 

// === Add Text Content Functionality ===
const addTextBtn = document.getElementById('add-text-btn');
const leftPanelContent = document.getElementById('left-panel-content'); 

if (addTextBtn && leftPanelContent) {
    addTextBtn.addEventListener('click', () => {
        const text = prompt('Enter your text content:');
        if (text !== null && text.trim() !== '') {
            const textItemDiv = document.createElement('div');
            textItemDiv.classList.add('study-material-item', 'text-item');
            textItemDiv.textContent = text; 
            leftPanelContent.appendChild(textItemDiv);
        }
    });
} else {
    console.error("Add Text Button or Left Panel Content container not found.");
}

// === Add Link Functionality ===
const addLinkBtn = document.getElementById('add-link-btn');

if (addLinkBtn && leftPanelContent) {
    addLinkBtn.addEventListener('click', () => {
        let url = prompt('Enter the URL (e.g., https://example.com):');
        if (url === null || url.trim() === '') return;
        url = url.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            if (confirm(`The URL "${url}" does not start with http:// or https://. Prepend "https://"?`)) {
                url = 'https://' + url;
            } else {
                alert('Invalid URL format. Please include http:// or https://.');
                return;
            }
        }
        const displayName = prompt('Enter a display name for the link:', url);
        if (displayName === null || displayName.trim() === '') return; 
        const linkItemDiv = document.createElement('div');
        linkItemDiv.classList.add('study-material-item', 'link-item');
        const linkElement = document.createElement('a');
        linkElement.href = url;
        linkElement.textContent = displayName.trim();
        linkElement.target = '_blank'; 
        linkElement.rel = 'noopener noreferrer'; 
        linkItemDiv.appendChild(linkElement);
        leftPanelContent.appendChild(linkItemDiv);
    });
} else {
    console.error("Add Link Button or Left Panel Content container not found.");
}

// === Add HTML/JS Block Functionality (Input Structure) ===
const addHtmlJsBtn = document.getElementById('add-html-js-btn');
const rightPanelContent = document.getElementById('right-panel-content');

if (addHtmlJsBtn && rightPanelContent) {
    addHtmlJsBtn.addEventListener('click', () => {
        const blockDiv = document.createElement('div');
        blockDiv.classList.add('visualization-item', 'html-js-block');

        // HTML Input Area
        const htmlLabel = document.createElement('label');
        htmlLabel.textContent = 'HTML Code:';
        const htmlTextarea = document.createElement('textarea');
        htmlTextarea.classList.add('code-input', 'html-input');
        htmlTextarea.placeholder = '<div id="myDiv">Hello</div>\n<style>\n  #myDiv { color: red; }\n</style>';
        blockDiv.appendChild(htmlLabel);
        blockDiv.appendChild(htmlTextarea);

        // JavaScript Input Area
        const jsLabel = document.createElement('label');
        jsLabel.textContent = 'JavaScript Code (runs after HTML is loaded):';
        const jsTextarea = document.createElement('textarea');
        jsTextarea.classList.add('code-input', 'js-input');
        jsTextarea.placeholder = 'document.getElementById("myDiv").style.color = "blue";';
        blockDiv.appendChild(jsLabel);
        blockDiv.appendChild(jsTextarea);

        // Preview/Run Button
        const previewBtn = document.createElement('button');
        previewBtn.classList.add('render-btn');
        previewBtn.textContent = 'Preview / Run';
        blockDiv.appendChild(previewBtn);

        // Output area for the preview
        const outputFrameContainer = document.createElement('div');
        outputFrameContainer.classList.add('output-frame-container');
        outputFrameContainer.style.display = 'none'; // Hidden until first preview
        blockDiv.appendChild(outputFrameContainer);

        rightPanelContent.appendChild(blockDiv);
    });
} else {
    console.error("Add HTML/JS Button or Right Panel Content container not found.");
}
