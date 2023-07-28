"use strict";
 // localStorage.removeItem("todoUser__");
 function validateFormData(){
     window.addEventListener("load",evt=>{
         const forms = document.getElementsByClassName("needs-validation");
         let validation = Array.prototype.filter.call(forms,(form)=>{
             form.addEventListener("submit",event=>{
                 if(form.checkValidity()===false){
                     event.preventDefault();
                     event.stopPropagation();
                 }else{
										 event.preventDefault();
                     event.stopPropagation();
                     let username = form.username.value;
                     if(!(username.includes(" ")) && username.length>=4){
                      localStorage.setItem("todoUser__",username);
                     location.href="main/main.html";
                     }else {
                     	form.reset();
                     	
                     }
  
                 }
               form.classList.add("was-validated");
             },false);
         });
     },false);
         
     }
     
    if(localStorage.getItem("todoUser__")){
    	location.href="main/main.html";
    }else{
     	validateFormData();
    }
     