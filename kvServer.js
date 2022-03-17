const express = require('express');
const fs = require('fs');

const DATA_DIR = 'disc_data';

const app = express();
app.use(express.json());

const hashTable = {};

app.post('/memory/:key', (req, res) => {
    hashTable[req.params.key] = req.body.data;
    console.log('Sucessfully inserted key - ' + req.params.key + ' value '+ req.body.data);
    res.send();
});

app.get('/memory/:key', (req, res) => {
    const key = req.params.key;
    if(key in hashTable){
        res.send('Data - ' + hashTable[key]);
        return;
    }else{
        res.send('Key not present');
    }
});

app.post('/disk/:key', (req, res) => {
    const destinationFile = `${DATA_DIR}/${req.params.key}`;
    console.log('Destination is - ' + destinationFile);
    fs.writeFileSync(destinationFile, req.body.data);
    res.send();
});

app.get('/disk/:key', (req, res) => {
    const destinationFile = `${DATA_DIR}/${req.params.key}`;
    try{
        const data = fs.readFileSync(destinationFile);
        res.send(data);
    }catch(ex){
        res.send('Key not found');
    }
});

app.listen(3001, () => {
    console.log('Listening on port 3001');
});