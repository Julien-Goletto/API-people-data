require('dotenv').config('../.env');
// console.log(process.env);

const pool = require('../app/model/pool');

const {faker} = require('@faker-js/faker');
faker.locale = 'fr';

const regexFind = /([a-zA-Z])'([a-zA-Z])/;
const regexReplace = /$1''$2/;

const users = [];
for (let counter = 0; counter<1e6;counter++){
  let user =({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email:'',
    userName:'',
    country: faker.address.country(),
    dogBreeed: `${faker.animal.dog()}`,
    setEmailAndUserName(){
      this.email = faker.internet.email(this.firstName,this.lastName);
      this.userName = faker.internet.userName(this.firstName,this.lastName);
    },
    sanitizeText(){
      if (regexFind.test(this.dogBreeed)){
        this.dogBreeed = this.dogBreeed.replace(regexFind,regexReplace);
      }
    }
  });
  user.setEmailAndUserName();
  user.sanitizeText();
  users.push(user);
};

console.log(users);

//Seeding by creating a unique query to push all users
async function seedDB(users){
  let query = `INSERT INTO "people"("first_name","last_name","email","user_name","country","dog_breed") VALUES \n`;
  for (const user of users){
    query += `('${user.firstName}','${user.lastName}','${user.email}','${user.userName}','${user.country}', '${user.dogBreeed}'),\n`
  }
  query = query.slice(0,-2) + ';';
  console.log(query);
  await pool.query(query);
}

seedDB(users);