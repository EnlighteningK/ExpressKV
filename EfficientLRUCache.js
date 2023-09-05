const express = require('express');
const fs = require('fs');

const DATA_DIR = 'disc_data';

const app = express();
app.use(express.json());

var head = {};
var tail = {};

head.next = tail;
head.prev = undefined;
head.req  = -1;

tail.prev = head;
tail.next = undefined;
tail.req  = -1;

var hashTable = {}

app.post('/express/:key', (req, res) => {
    const key = req.params.key;
    if(hashTable.size > 6){
        let evictedElement = resizeQueue();
        res.status(201).send('Successfully inserted key - ' + req.params.key + ' value - ' + req.body.data + ' and evicted key - ' + evictedElement.req.params.key);
    }else{
        let newElement = {};
        newElement.req = req;
        add(newElement);
        hashTable[key] = newElement;
        res.status(201).send('Successfully inserted key - ' + req.params.key + ' value - ' + req.body.data);
    }
});


app.get('/express/:key', (req, res) => {
    const key = req.params.key;

    if(key in hashTable){
        let element = hashTable[key];
        remove(element);
        add(element);
        res.status(200).send('Successfully read from memory key - ' + key + ' value - '+ element.req.body.data);
    }else{
        let element = readFromDisk(req, res);
        if(element){
            if(hashTable.size > 6){
                let evictedElement = resizeQueue();
                hashTable[key] = element;
                res.status(200).send('Successfully read from disc key - ' + key + ' value - '+ element.req.body.data + ' and evicted key - ' + evictedElement.req.params.key);
            }else{
                hashTable[key] = element;
                res.status(200).send('Successfully read from disc key - ' + key + ' value - '+ element.req.body.data);
            }
        }
    }
});


var remove = (node) => {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    head.next = node;
};

var add = (node) => {
    tail.prev.next = node;
    node.prev = tail.prev;
    node.next = tail;
    tail.prev = node;
}

var resizeQueue = () => {
    let elementToBeWrittenTodisk = head.next;
    remove(elementToBeWrittenTodisk);
    hashTable.delete(elementToBeWrittenTodisk);
    writeToDisk(elementToBeWrittenTodisk.req, elementToBeWrittenTodisk.res);
    return elementToBeWrittenTodisk;
}

var readFromDisk = (req, res) => {
    console.log('Key not in memory trying disk');
    const destinationFile = `${DATA_DIR}/${req.params.key}`;
    try{
        const data = fs.readFileSync(destinationFile);
        return data;
    }catch(ex){
        res.send('Key not found');
    }
};

var writeToDisk = (req, res) => {
    const destinationFile = `${DATA_DIR}/${req.params.key}`;
    console.log('Destination is - ' + destinationFile);
    try{
        fs.writeFileSync(destinationFile, req.body.data);
    }catch(ex){
        res.status(500).send('Internal Server Error');
    }
};

app.listen(3001, () => {
    console.log('Listening on port 3001');
});