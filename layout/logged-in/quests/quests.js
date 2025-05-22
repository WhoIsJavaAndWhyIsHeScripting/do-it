function loadQuestProgress() {
    fetch('/load-quest-progress', {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(data => {
        
    })
}