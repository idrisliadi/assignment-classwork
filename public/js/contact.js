const { $where } = require("../../Model/User");

let sendmessageBtn = document.getElementById("msgBtn")
sendmessageBtn = addEventListener("click" , (e) =>{
    e.preventDefault();
    $.ajax({
        type : "POST",
        url : "/coontact",
        // data : $("#contactForm").serialize(),
        success : function(data){
            console.log(data)
        }
    })
})
// alert ("hello")
// console.log($)