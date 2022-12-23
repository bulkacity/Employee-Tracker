// This will have a list of functions to handle the selection options, will be called after prompt.js case check

const mysql= require('mysql2');

class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host : process.env.DB_HOST || 'http://localhost:3306',
            user : process.env.DB_USER || 'root',
        })
     }
        
}

module.exports = new Database();