function showTaskCreator() {
    let taskCreator = document.getElementById("task-creator")
    let isHidden = (taskCreator.style.display == "none");
    if (isHidden) {
        taskCreator.style.display = "block";
        document.getElementById("toggle-add-task").textContent = "Cancel";
    } else {
        taskCreator.style.display = "none";
        document.getElementById("toggle-add-task").textContent = "Add New Task";
    }
}

function createTask() {
    let taskName = document.getElementById("todo-input").value;
    let todoItem = document.createElement("li");
    todoItem.class = "todo";
    todoItem.textContent = taskName;
    let remover = document.createElement("button");
    remover.textContent = "X";
    remover.class = "remover";
    todoItem.appendChild(remover);
    remover.addEventListener("click", () => {
        remover.parentElement.style.display = "none";
    })
    document.getElementById("to-do-list").appendChild(todoItem);
}
