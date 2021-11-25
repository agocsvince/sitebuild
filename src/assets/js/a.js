let pages = document.getElementsByClassName('pages')[0].childNodes;

console.log(pages);

function removeAllId() {
    pages.forEach(element => {
        if (element.nextSibling !== null) {
            if (element.nextSibling.id !== null) {
                element.nextSibling.id = "";
            }
        }
    });
}

function checkStatus() {
    pages.forEach(element => {
        if (element.nextSibling !== null) {
            if (element.nextSibling.nodeName === "A") {
                if (element.nextSibling.id === 'current-page') {
                    element.nextSibling.style.color = '#F58500';
                } else {
                    element.nextSibling.style.color = '#000';
                }
            }
        }
    });
}

function addStatus(e) {
    removeAllId()
    e.srcElement.id = 'current-page';
    console.log(e.srcElement);
    checkStatus()
}

pages.forEach(element => {
    
    element.addEventListener('click', () => addStatus(event));
    
});





