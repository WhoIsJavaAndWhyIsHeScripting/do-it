function toggleElement(container, toggler, defaultMessage, toggledMessage) {
    let taskCreator = document.getElementById(container)
    let isHidden = (taskCreator.style.display == "none");
    if (isHidden) {
        taskCreator.style.display = "block";
        document.getElementById(toggler).textContent = toggledMessage;
    } else {
        taskCreator.style.display = "none";
        document.getElementById(toggler).textContent = defaultMessage;
    }
}
var targetList = "my-first-to-do-list-tasks"
function createTask() {
    let taskName = document.getElementById("todo-input").value;
    let todoItem = document.createElement("li");
    todoItem.className = "todo";
    let todoLabel = document.createElement("label");
    todoLabel.textContent = taskName;
    let todoCheckbox = document.createElement("input");
    // to do: check for duplicate IDs and handle accordingly
    todoCheckbox.id = taskName.toLowerCase().split(" ").join("-");
    todoCheckbox.type = "checkbox";
    todoLabel.for = todoCheckbox.id;
    todoLabel.appendChild(todoCheckbox);
    todoCheckbox.addEventListener("click", () => {
        todoLabel.className = "checked-waiting";
        setTimeout(() => {
            todoCheckbox.parentElement.parentElement.style.display = "none";
            // to do: completed list
            // to do: add currency
            // to do: progress quests
        }, 1000);
    })
    let remover = document.createElement("button");
    remover.textContent = "X";
    remover.class = "remover";
    todoItem.appendChild(remover);
    remover.addEventListener("click", () => {
        remover.parentElement.style.display = "none";
    })
    todoItem.appendChild(todoLabel);
    document.getElementById(targetList).appendChild(todoItem);
    document.getElementById("todo-input").value = "";
}
function createCategory() {
    let categoryName = document.getElementById("new-category-name").value;
    let categoryContainer = document.createElement("div");
    categoryContainer.className = "category";
    let categoryTitle = document.createElement("h2");
    categoryTitle.textContent = categoryName;
    let categoryList = document.createElement("ul");
    let containerId = categoryName.toLowerCase().split(" ").join("-");
    categoryContainer.id = containerId;
    let listId = containerId + "-tasks";
    categoryList.id = listId;
    categoryContainer.appendChild(categoryTitle);
    categoryContainer.appendChild(categoryList);
    document.getElementById("categories-container").appendChild(categoryContainer);
    addCategoryLink(categoryName);
    let categories = document.getElementsByClassName("category");
    Array.prototype.forEach.call(categories, e => {
        e.style.display = "none";
    });
    document.getElementById(containerId).style.display = "block";
    targetList = containerId + "-tasks";
    document.getElementById("new-category-name").value = "";
    toggleElement('new-category-container', 'toggle-new-category', 'Create New Category', 'Cancel');
}

function addCategoryLink(name) {
    let catLink = document.createElement("button");
    catLink.textContent = name;
    var catId = name.toLowerCase().split(" ").join("-");
    catLink.id = catId + "-link";
    catLink.addEventListener("click", () => {
        let categories = document.getElementsByClassName("category");
        Array.prototype.forEach.call(categories, e => {
            e.style.display = "none";
          });
        document.getElementById(catId).style.display = "block";
        targetList = catId + "-tasks";
    })
    document.getElementById("category-link-container").appendChild(catLink);
}
