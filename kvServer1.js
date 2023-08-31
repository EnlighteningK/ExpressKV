const express = require('express');
const fs = require('fs');

const DATA_DIR = 'disc_data';

const app = express();
app.use(express.json());

var queue = []; // Use a queue data structure instead for better performance
var hashTable = {};

app.post('/LRUCache/:key', (req, res) => {
    // Write to disk
    if(queue.length > 5){
        let elementToBeWrittenTodisk = queue.shift();
        delete hashTable[elementToBeWrittenTodisk.req.params.key];
        writeToDisk(elementToBeWrittenTodisk.req, elementToBeWrittenTodisk.res);
        hashTable[req.params.key] = req.body.data;
    }else{
        var reqResObject = {};
        reqResObject.req = req;
        reqResObject.res = res;
        queue.push(reqResObject);
        hashTable[req.params.key] = req.body.data;
    }

    console.log('Sucessfully inserted key - ' + req.params.key + ' value '+ req.body.data);
    res.send();
});

app.get('/LRUCache/:key', (req, res) => {
    const key = req.params.key;
    const reqResObject = {};
    reqResObject.req = req;
    reqResObject.res = res;

    let initSize = queue.length;

    if(initSize > 5){
        queue = queue.filter(obj => obj.req.params.key != key);
        if(initSize == queue.length)queue.push(reqResObject);
    }else{
        queue.push(reqResObject);
    }

    if(key in hashTable){
        res.send('Data in Memory - ' + hashTable[key]);
    }else{
        readFromDisk(req, res);
        hashTable[req.params.key] = req.body.data;
    }
});

var readFromDisk = (req, res) => {
    console.log('Key not in memory trying disk');
    const destinationFile = `${DATA_DIR}/${req.params.key}`;
    try{
        const data = fs.readFileSync(destinationFile);
        res.send('Data in Disk - ' + data);
    }catch(ex){
        res.send('Key not found');
    }
};

var writeToDisk = (req, res) => {
    const destinationFile = `${DATA_DIR}/${req.params.key}`;
    console.log('Destination is - ' + destinationFile);
    try{
        fs.writeFileSync(destinationFile, req.body.data);
        res.send();
    }catch(ex){
        res.status(500).send('Internal Server Error');
    }
};

app.listen(3001, () => {
    console.log('Listening on port 3001');
});