const API = {

delay(ms){
return new Promise(res=>setTimeout(res,ms));
},

async createUser(user){
await this.delay(500);
let users=JSON.parse(localStorage.getItem("users"))||[];
users.push(user);
localStorage.setItem("users",JSON.stringify(users));
return user;
},

async getUsers(){
await this.delay(300);
return JSON.parse(localStorage.getItem("users"))||[];
},

async saveUsers(users){
await this.delay(300);
localStorage.setItem("users",JSON.stringify(users));
},

async saveOrder(order){
await this.delay(500);
let orders=JSON.parse(localStorage.getItem("orders"))||[];
orders.push(order);
localStorage.setItem("orders",JSON.stringify(orders));
},

async getOrders(){
await this.delay(300);
return JSON.parse(localStorage.getItem("orders"))||[];
}

}
