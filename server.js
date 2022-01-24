const net = require('net')

var players = []
var gameState = 0


net.createServer((socket) => {

    socket.on('data', (data) => {
        var msg = data.toString()
        var player = findPlayer(socket.remoteAddress, socket.remotePort)
        
        if(gameState == 0)
        {
            if(msg == 'join' && player == null && players.length == 0) 
            {
                players.push({
                    addr: socket.remoteAddress,
                    port: socket.remotePort,
                    name: `P1`,
                    attack: null,
                    client: socket
                })
                socket.write('P1(You) have joined a server. \ntype <ready> When you are ready.')
                
                console.log(`P1 joined.`)
                return
            }

            if(msg == 'join' && player == null && players.length == 1) 
            {
                players.push({
                    addr: socket.remoteAddress,
                    port: socket.remotePort,
                    name: `P2`,
                    attack: null,
                    client: socket
                })
                socket.write('P2(You) have joined a server. \ntype <ready> When you are ready.')
                
                console.log(`P2 joined.`)
                return
            }
                
            if(msg == 'ready' && player != null)     // ready
            {
                player['ready'] = 'ready'
                console.log(`${player.name}(${player.addr}:${player.port}) is ready.`)
                if(getReadyPlayer() == 2)
                {
                    console.log('All players are ready.')
                    gameState = 1
                    
                    announce('Type rock, paper or scissor')
                }
                return
            }   

            else{
                socket.write('Invalid')
            }
        }

        if(gameState == 1)
        {
            if(msg == 'rock' || msg == 'paper' || msg == 'scissor'){
                player['attack'] = msg
                if(getAnsPlayer() == 2){
                    console.log('Calulating')
                    fight(players[0],players[1])
                }
            }
        
            else{
                socket.write('invalid')
            }
        }
    })

    socket.on('close', function(){
        console.log(`${socket.remoteAddress}:${socket.remotePort} disconnected.`)
    })

    socket.on('error', function(err){
        
    })

}).listen(6969, '127.0.0.1')
console.log('Server listening on 127.0.0.1:6969')

function findPlayer(addr, port)
{
    for(var player of players)
    {
        if(player['addr'] == addr && player['port'] == port) return player
    }
    return null
}

function getReadyPlayer()
{
    var num = 0
    for(var player of players)
    {
        if(player['ready'] == 'ready') num += 1
    }
    return num
}


function getAnsPlayer()
{
    var num = 0
    for(var player of players)
    {
        if(player['attack'] == 'rock' || player['attack'] == 'paper' || player['attack'] == 'scissor') 
            num += 1
    }
    return num
}

function fight(P1,P2){
    if(P1['attack'] == 'rock' && P2['attack'] == 'paper'){
        announce('P2 win.')
    }
    else if(P1['attack'] == 'rock' && P2['attack'] == 'scissor'){
        announce('P1 win')
    }
    else if(P1['attack'] == 'paper' && P2['attack'] == 'rock'){
        announce('P1 win')
    }
    else if(P1['attack'] == 'paper' && P2['attack'] == 'scissor'){
        announce('P2 win')
    }
    else if(P1['attack'] == 'scissor' && P2['attack'] == 'paper'){
        announce('P1 win')
    }
    else if(P1['attack'] == 'scissor' && P2['attack'] == 'rock'){
        announce('P2 win')
    }
    else if(P1['attack'] == P2['attack']){
        announce('DRAW.')
    }
}

function announce(msg)
{
    for(var player of players)
    {
        player.client.write(msg)
    }
}