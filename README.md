# ExpressKV
A simple in Memory and persistent Key - Value store by RESTful endpoints in ExpressJs
This app demostrates keeping key value pairs either in memory or persisting them to disk.


Setup - 
npm init

Run - 
node kvExpress.js

Sample commands - 
curl localhost:3001/disk/foo --header 'Content-Type:application/json' --data '{"data":"This is some data on disk"}'

Or use POSTMAN
