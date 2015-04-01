describe('socket.io', function() {
   
    var io;
    
    beforeEach(function() {
        io = require('socket.io').listen(8080);
        io.on('connection', function(socket) {
            socket.emit('welcome', 'home');
        });
    });
    
    afterEach(function() {
        io.close();
    });

    var messageCount = 0;
    
    it('can connect and receive pong', function(done) {
        var socket = require('socket.io-client')('http://localhost:8080');
        socket.on('welcome', function(data) {
            messageCount ++;
            expect(data).toEqual('home');
            done();
        });
    });

    it('can connect on a different channel', function(done) {
        var socket = require('socket.io-client')('http://localhost:8080', { forceNew: true });
        socket.on('welcome', function(data) {
            expect(messageCount).toEqual(1);
            done();
        });
    });
});