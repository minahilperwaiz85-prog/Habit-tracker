import { habitStore } from "./habitStore.js";
const habitForm = document.getElementById("habitForm");
const habitInput = document.getElementById("habitInput");
const habitList = document.getElementById("habitList");
const habitCounter =document.getElementById("habitCounter");
const completedCounter = document.getElementById("completedCounter");
const searchInput = document.getElementById("searchInput");
const themeBtn = document.getElementById("themeBtn");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const habitReg = /^[A-Za-z][A-Za-z]{1,29}$/;
const viewedHabits = new WeakMap();
habitForm.addEventListener("submit", function(event){
    event.preventDefault();
    const habitName = habitInput.value.trim();
    if(!habitReg.test(habitName)){
        alert("please enter a valid habit name(2-30 letters).");
        return;
    }
    
    habitStore.addHabit(habitName);
    displayHabits();
 habitInput.value="";
});
let visibleHabits = 5;
let habitIterator;
function* habitGenerator(habits) {
    for (const habit of habits) {
        yield habit;
    }
}

function displayHabits(){
    habitList.innerHTML="";
    const searchText = searchInput.value.toLowerCase();
    const filteredHabits = habitStore.getHabits().filter(function(habit){
        return habit.name.toLowerCase().includes(searchText);
    });
           const generator = habitGenerator(filteredHabits);
let count = 0;

for (const habit of generator) {
    if (count >= visibleHabits) break;
    count++;
    viewedHabits.set(habit, true);
    console.log("Viewed Habit:", habit.name, viewedHabits.get(habit));
    const li = document.createElement("li");
const span = document.createElement("span");
span.textContent = habit.name;
if (habit.completed) {
    span.style.textDecoration = "line-through";
}
        const doneButton =document.createElement("button");
        doneButton.textContent=habit.completed ? "undo" :"Done";
        doneButton.dataset.action="done";
        doneButton.dataset.id= habit.storageId;
        const deleteButton = document.createElement("button");
        deleteButton.textContent ="Delete";
        deleteButton.dataset.action ="delete";
        deleteButton.dataset.id=habit.storageId;
        li.append(span, doneButton,deleteButton);
        habitList.appendChild(li);
    }
updateCounters();
}
loadMoreBtn.addEventListener("click", function() {
    visibleHabits += 5;
    displayHabits();
});
habitList.addEventListener("click", function(event){
    const action= event.target.dataset.action;
    const id = event.target.dataset.id;
    console.log("Action:", action, "ID:",id);
    if(!action || !id)return;
    if(action ==="done"){
        habitStore.toggleHabit(id);
    }
    if(action ==="delete"){
        habitStore.deleteHabit(id);
        }
    });
    displayHabits();
function updateCounters(){
    habitCounter.textContent="Total Habits:"+ habitStore.getHabits().length;
    const completed = habitStore.getHabits().filter(function(habit){
        return habit.completed;
    }).length;
    completedCounter.textContent="Completed:"+ completed;
}
habitStore.subscribe(function(){
    displayHabits();
    updateCounters();
});
const savedTheme = sessionStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

themeBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        sessionStorage.setItem("theme", "dark");
    } else {
        sessionStorage.setItem("theme", "light");
    }
});

function debounce(callback,delay){
    let timer;
    return function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
            callback();
        }, delay);
    };
}
const searchHabits = debounce(function(){
    displayHabits();
}, 500);
searchInput.addEventListener("input", searchHabits);
displayHabits();
function throttle(callback,delay){
    let lastTime = 0;
    return function(){
        const currentTime = Date.now();
        if(currentTime - lastTime >= delay){
            callback();
            lastTime = currentTime;
        }
    };
}
const scrollMessage = throttle(function(){
    console.log("page is scrolling!");
},1000);
window.addEventListener("scroll",scrollMessage);
