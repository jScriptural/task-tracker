"use strict";
const searchForm = document.forms.searchForm;
const searchBtn = document.querySelector("#searchBtn");
const createTaskBtn = document.getElementById("createTaskBtn");
let id = 100;
let lastTaskId;
const taskContainer = document.getElementById("taskCon");
let tasks =
JSON.parse(localStorage.getItem('tasks__'))?[...JSON.parse(localStorage.getItem('tasks__'))]:[];
const username = localStorage.getItem("todoUser__");
if(username)document.querySelector("marquee").innerHTML=`Welcome to Task Tracker,
${username}.`;




function loadTask(){
	if(tasks.length===0)return;
	taskContainer.innerHTML = "";
	tasks.sort((a,b)=>a.priority-b.priority);
	for(let task of tasks){
		taskContainer.insertAdjacentHTML("afterbegin",`
		<div class="my-2 p-1 border rounded" data-task_id=${task.id}><div
		class="d-flex justify-content-between"><div
		class=" task-body ms-3">${task.task_body}</div>
		<div class="mx-2"><span class="fa fa-trash-alt fa-regular delete"> </span></div></div>
		<div class="details mt-3" hidden>
		<hr>
		<ul>
		  <li>Category: ${task.category} </li>
		  <li>Priority level: ${task.priority===1?"High":"Low"} </li>
		  <li>Creation date: ${task.creation_date?task.creation_date:" "} </li>
		  <li>Due: ${task.due_date?task.due_date:" "} </li>
		  <li>ID: ${task.id} </li>
		</ul>
		</div>
		</div>
		`);
	}
	document.querySelectorAll("[data-task_id]").forEach(elem=>{
		elem.addEventListener("click",evt=>{
			if(evt.target.classList.contains("delete")){
				let id = evt.currentTarget.dataset.task_id;
				tasks.forEach((task,index,tasks)=>{
					if(+task.id == +id)tasks.splice(index,1);
					localStorage.setItem("tasks__",JSON.stringify(tasks));
				});
				evt.currentTarget.remove();
			
			}else{
	    evt.currentTarget.querySelector(".details").hidden =
	        !evt.currentTarget.querySelector(".details").hidden;
			}

		});
	});
}

loadTask();

function createTask(event){
	let form = document.createElement("form");
	let div = document.createElement("div");
	div.className="container-fluid task-form-con animation-slide-in-right";
	form.className="task-form rounded stylish";
	div.innerHTML=`  
		<div class="d-flex p-4 text-danger justify-content-end
	align-items-center"><span id="closeIcon" class="fa
	fa-times p-1 rounded-circle"></span></div>
	`;
	form.insertAdjacentHTML("afterbegin",`
	<div>
    <div class="mb-3 ms-2 p-2">
        <label class="form-label" for="taskCategory">Category</label>
       <input class="form-input" type="text" placeholder="task category"
       name="cat" id="taskCategory" required>
       </div>
       <div class="mb-3 ms-2 p-2">
           <label class="form-label" for="taskBody">Task body</label>
           <input type="text" name="task_body" id="taskBody"
           class="form-input" placeholder=" Your task" required>
       </div>
       <div class="mb-3 ms-2 p-2">
        <label class="form-label" for="dueDate">Due Date</label>
       <input class="form-input" type="date" placeholder="Date due"
       name="due_date" id="dueDate">
       </div>
       <div class="mb-3 ms-2 p-2">
           <div class="row">
             <div class="col-12">Priority Level </div>
               <div class="col-12">
                   <div class="form-check form-check-inline">
                       <input type="radio" name="priority"
                       class="form-check-input" value="0" id="lowPriority"
                       checked>
                       <label for="lowPriority" class="form-check-label">Low</label>
                   </div>
                   <div class="form-check form-check-inline">
                       <input id="highPriority" value="1" type="radio"
                       name="priority" class="form-check-input">
                       <label for="highPriority" class="form-check-label">High</label>
                   </div>
               </div>
           </div>
       </div>
       <div class="mb-3 p-2 text-center">
           <button type="submit" class="btn btn-success btn-lg">Save task</button>
       </div>
  </div> 
	`);
	div.append(form);
	document.body.append(div);
	form.addEventListener("submit",evt=>{
		if(form.checkValidity() && form.task_body.value.trim().length !== 0 &&
		form.cat.value.trim().length !==0){
			evt.preventDefault();
			evt.stopPropagation();
			let [category,taskBody,creationDate,dueDate] =
			[form.cat.value,form.task_body.value,new
			Date().toDateString(),form.due_date.value];
			let priority;
			form.priority.forEach(radbtn=>{
				if(radbtn.checked)priority=+radbtn.value;
			});
			
			let lastTaskId = localStorage.getItem("lastTaskId");
			if(!lastTaskId){
				lastTaskId = id;
				localStorage.setItem("lastTaskId",lastTaskId);
			}else {
				lastTaskId = +lastTaskId;
				lastTaskId++;
				localStorage.setItem("lastTaskId",lastTaskId);
			}
			tasks.push({category:
			category,task_body:taskBody,priority:priority,creation_date:creationDate,due_date:dueDate,id:lastTaskId});
			localStorage.setItem("tasks__",JSON.stringify(tasks));
			loadTask();
			document.querySelector("#closeIcon").dispatchEvent(new Event("click"));
			
		}else{
			evt.preventDefault();
			evt.stopPropagation();
		}
	});
	document.querySelector("#closeIcon").addEventListener("click",evt=>{
		div.classList.remove("animation-slide-in-right");
		div.classList.add("animation-slide-out-left");
		div.addEventListener("animationend",function(event){
			this.remove();
		
	});
	});
}
createTaskBtn.addEventListener("click",createTask);








//Implementation of the search functionality
//prevent form submission
searchForm.addEventListener("submit",evt=>{
	evt.preventDefault();
	evt.stopPropagation();
});
searchBtn.addEventListener("click",event=>{
const searchResultCon = document.createElement("div");
const searchResultDiv= document.createElement("div");

searchResultCon.classList.add("search-result-con");
	let savedTasks = JSON.parse(localStorage.getItem("tasks__"));
	let searchResult;
	let searchItem  = searchForm.searchItem.value.trim();
	if(!savedTasks && searchItem.length !== 0)return;
	
	if(Number.isInteger(+searchItem)){
		searchItem = +searchItem;
		searchResult=savedTasks.filter((task)=>{
			return task.id === searchItem;
		});
	}else {
		searchResult = savedTasks.filter((task)=>{
			 return task.category.toLowerCase().includes(searchItem.toLowerCase());
		});
	}
	searchForm.reset();

	  searchResultCon.innerHTML=` 
	<div class="d-flex mb-5 p-1 text-danger justify-content-end
	align-items-center"><span id="closeIcon" class="fa
	fa-times p-1 rounded-circle"></span></div>
	<hr>
	  `;
if(searchResult.length === 0){
	  	searchResultDiv.innerHTML=`<div class="text-secondary pop">No result for
	  	'${searchItem===0?"":searchItem}'</div>`;
	  }
	  
   for(let task of searchResult){
		searchResultDiv.insertAdjacentHTML("afterbegin",`
		<div  class="my-2 p-1 border rounded" data-task_id=${task.id}><div
		class="d-flex justify-content-between"><div
		class=" task-body ms-3">${task.task_body}</div>
		<div class="mx-2"><span class="fa fa-trash-alt delete"> </span></div></div>
		<div class="details mt-3" hidden>
		<hr>
		<ul>
		  <li>Category: ${task.category} </li>
		  <li>Priority: ${task.priority===1?"High":"Low"} </li>
		  <li>Creation date: ${task.creation_date?task.creation_date:" "} </li>
		  <li>Due: ${task.due_date?task.due_date:" "} </li>
		  <li>ID: ${task.id} </li>
		</ul>
		</div>
		</div>
		`);
	}
searchResultCon.append(searchResultDiv);
	document.body.append(searchResultCon);
document.querySelectorAll("[data-task_id]").forEach(elem=>{
		elem.addEventListener("click",evt=>{
			if(evt.target.classList.contains("delete")){
				let id = evt.currentTarget.dataset.task_id;
				savedTasks.forEach((task,index,tasks)=>{
					if(+task.id == +id)savedTasks.splice(index,1);
					localStorage.setItem("tasks__",JSON.stringify(savedTasks));
				});
				tasks = savedTasks;
				evt.currentTarget.remove();
			
			}else{
	    evt.currentTarget.querySelector(".details").hidden =
	        !evt.currentTarget.querySelector(".details").hidden;
			}

		});
	});
	searchResultCon.classList.add("animation-slide-in-right");
	
document.querySelector("#closeIcon").addEventListener("click",evt=>{
	searchResultCon.classList.remove("animation-slide-in-right");
	searchResultCon.classList.add("animation-slide-out-left");
	searchResultCon.addEventListener("animationend",function(evt){
		    this.remove();
	});
		loadTask();
	});
});

searchForm.searchItem.onkeyup=event=>{
	if(event.key === "Enter")searchBtn.dispatchEvent(new Event("click"));
};
