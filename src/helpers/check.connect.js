// check number of connections to database

'use strict';
const mongoose = require('mongoose');
const os = require('os');

const checkConnections = () => {
    const connections = mongoose.connections;
    console.log('Connection number ', connections.length);
    connections.forEach((conn, index) => {
        console.log(`Connection ${index}:`);
        console.log(`  Ready State: ${conn.readyState}`);
        console.log(`  Host: ${conn.host}`);
        console.log(`  Port: ${conn.port}`);
        console.log(`  Name: ${conn.name}`);
    });
}

const checkOverLoad = () => {
    const connections = mongoose.connections;
    let activeConnections = 0;
    // setInterval(() => {
    //     const comCore = os.cpus().length;
    //     const memory = process.memoryUsage().rss / (1024 * 1024); // in MB
    //     console.log('core', comCore);
    //     console.log('memory', memory);
        
    // }, 5000);
}

module.exports = { checkOverLoad, checkConnections };