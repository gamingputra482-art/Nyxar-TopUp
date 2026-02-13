const App = {

async login(){
let username=document.getElementById("username").value;
let role=document.getElementById("role").value;
if(!username)return alert("Isi username!");

let users=await API.getUsers();
let user=users.find(u=>u.name===username);

if(!user){
user={name:username,role:role,saldo:100000,total:0};
await API.createUser(user);
}

localStorage.setItem("currentUser",JSON.stringify(user));
this.showHome();
},

showHome(){
document.getElementById("loginPage").classList.add("hidden");
document.getElementById("home").classList.remove("hidden");
this.updateUI();
},

updateUI(){
let user=JSON.parse(localStorage.getItem("currentUser"));
document.getElementById("navUser").innerText=user.name+" | Rp"+user.saldo;
document.getElementById("userInfo").innerHTML=
"Saldo: Rp"+user.saldo+"<br>Total: Rp"+user.total;

if(user.role==="admin")
document.getElementById("adminBtn").classList.remove("hidden");
},

async topupSaldo(){
let users=await API.getUsers();
let user=JSON.parse(localStorage.getItem("currentUser"));

user.saldo+=50000;
users=users.map(u=>u.name===user.name?user:u);

await API.saveUsers(users);
localStorage.setItem("currentUser",JSON.stringify(user));
this.updateUI();
},

async orderGame(game){
let nominal=parseInt(prompt("Nominal?"));
if(!nominal)return;

let users=await API.getUsers();
let user=JSON.parse(localStorage.getItem("currentUser"));

if(user.saldo<nominal)return alert("Saldo kurang!");

user.saldo-=nominal;
user.total+=nominal;

users=users.map(u=>u.name===user.name?user:u);
await API.saveUsers(users);

await API.saveOrder({
user:user.name,
game:game,
nominal:nominal,
date:new Date().toLocaleString()
});

localStorage.setItem("currentUser",JSON.stringify(user));
alert("Transaksi berhasil!");
this.updateUI();
},

async showHistory(){
document.getElementById("home").classList.add("hidden");
document.getElementById("historyPage").classList.remove("hidden");

let orders=await API.getOrders();
let user=JSON.parse(localStorage.getItem("currentUser"));

let html="";
orders.filter(o=>o.user===user.name).forEach(o=>{
html+=`<div class="card">${o.game} - Rp${o.nominal}<br>${o.date}</div>`;
});

document.getElementById("historyList").innerHTML=html||"Belum ada transaksi.";
},

async showRanking(){
document.getElementById("home").classList.add("hidden");
document.getElementById("rankingPage").classList.remove("hidden");

let users=await API.getUsers();
users.sort((a,b)=>b.total-a.total);

let html="";
users.forEach((u,i)=>{
html+=`<div class="card">#${i+1} ${u.name} - Rp${u.total}</div>`;
});

document.getElementById("rankingList").innerHTML=html;
},

async showAdmin(){
document.getElementById("home").classList.add("hidden");
document.getElementById("adminPage").classList.remove("hidden");

let users=await API.getUsers();
let orders=await API.getOrders();

document.getElementById("adminStats").innerHTML=
"Total User: "+users.length+"<br>Total Order: "+orders.length;
},

backHome(){location.reload();},

resetData(){
localStorage.clear();
location.reload();
},

logout(){
localStorage.removeItem("currentUser");
location.reload();
}

}

window.onload=function(){
if(localStorage.getItem("currentUser"))
App.showHome();
}
