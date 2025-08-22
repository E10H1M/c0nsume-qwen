# Setting up the front end
## Installing the `requirements`
Some requiremnts for linux:
- pkg-config
- libssl-dev
```
sudo apt update
sudo apt install pkg-config libssl-dev
```


To build the rust project you would run this command:
```
cargo build
```
This will compile the rust project turning it into executable binaries. 


## Starting up the `server`
This will run the binaries allowing for you to visit the server route:
```
cargo run
```