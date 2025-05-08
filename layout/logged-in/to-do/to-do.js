/* toggles an input and changes text of the button used to toggle it
container - the element that contains the input, add button and toggle button
toggler - the element that you click to show/hide the input
defaultMessage - the text on the toggler button when the input is hidden e.g. "add task"
toggledMessage - the text on the toggler button when the input is shown e.g. "cancel add task" */
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
// the target list will be the category that tasks are added to
var targetList = "my-first-to-do-list-tasks";
// this dictionary will store all categories and associated tasks
var dataDictionary = {};
// each key will be a category name with a value of an array of task names
dataDictionary["my-first-to-do-list"] = [];
/* creates a new task with the input as its name. will be a li element
with a label for the task name and button for removing the task inside, and a 
checkbox inside the input to mark the task as completed */
function createTask(task = document.getElementById("todo-input").value, list = targetList) {
    let taskName = task;
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
    // strike through the task then delete it when completed
    todoCheckbox.addEventListener("click", () => {
        // strike through class
        todoLabel.className = "checked-waiting";
        setTimeout(() => {
            todoCheckbox.parentElement.parentElement.style.display = "none";
            let index = dataDictionary[list.slice(0, -6)].indexOf(taskName);
            dataDictionary[list.slice(0, -6)].splice(index, 1);
            // to do: completed list
            // to do: add currency
            // to do: progress quests
        }, 1000);
    })
    // create button to delete the task
    let remover = document.createElement("button");
    remover.textContent = "X";
    remover.className = "remover";
    todoItem.appendChild(remover);
    remover.addEventListener("click", () => {
        remover.parentElement.style.display = "none";
        let index = dataDictionary[list.slice(0, -6)].indexOf(taskName);
        dataDictionary[list.slice(0, -6)].splice(index, 1);
    })
    todoItem.appendChild(todoLabel);
    document.getElementById(list).appendChild(todoItem);
    // clear input
    document.getElementById("todo-input").value = "";
    // update data (the slice method is to slice off the -tasks so it's just the category name)
    dataDictionary[list.slice(0, -6)].push(taskName);

}
// to do: add default parameters for loading data

/* creates a new list of tasks with a name. is a div with an h2 inside it for the 
title, and a ul to hold the tasks. The id of the container div will be "id", and the 
id of the ul will be "id-tasks". each category container will have the class "category" */
function createCategory(catName = document.getElementById("new-category-name").value) {
    let categoryName = catName;
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
    // switch to the newly created category
    let categories = document.getElementsByClassName("category");
    Array.prototype.forEach.call(categories, e => {
        e.style.display = "none";
    });
    document.getElementById(containerId).style.display = "block";
    targetList = containerId + "-tasks";
    // clear the input and hide it
    document.getElementById("new-category-name").value = "";
    toggleElement('new-category-container', 'toggle-new-category', 'Create New Category', 'Cancel');
    // create new key/value pair for this category and its list
    dataDictionary[containerId] = [];
}
// creates a link in the sidebar to activate a category
// name - name of the category
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

function saveData() {
    fetch('/save-data', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataDictionary)
    })
    .then(response => {
        if (response.ok) {
            console.log("saved data");
        } else {
            console.log("error");
        }
    })
    .catch(error => console.log(error));

}

function loadData() {
    fetch('/load-data', {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        let categoryList = ["my-first-to-do-list"];
        for ([key, object] of Object.entries(data)) {
            var category = object.categoryName;
            var task = object.taskName;
            if (categoryList.indexOf(category) == -1) {
                createCategory(category);
                categoryList.push(category);
            }
            createTask(task, category.toLowerCase().split(" ").join("-") + "-tasks");
        }
    })
}