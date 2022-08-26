describe('web-sockets', function () {

    var io;
    var app;
    var server;
    var serverSocket;

    const Browser = require('zombie');
    const browser = new Browser();

    beforeEach(function (done) {

        var handler = function (request, response) {
            response.setHeader('Content-Type', 'text/html');
            var page = '<html>' +
                '<body>' +
                '<script src="/socket.io/socket.io.js"></script>' +
                '<script>' +
                'function connection() {' +
                'var socket = io.connect("http://localhost:5000");' +
                'socket.on("status", function (data) {' +
                'document.getElementById("status").innerHTML = data;' +
                '});' +
                '};' +
                '</script>' +
                '<button id="connect" onmouseup="connection();">Go!</button>' +
                '<label id="status">waiting...</label>' +
                '</body>' +
                '</html>';
            response.write(page);
            response.end();
        };

        app = require('http').createServer(handler);
        io = require('socket.io')(app);
        io.on('connection', function (s) {
            serverSocket = s
        });

        app.listen(5000, done);
    });

    afterEach(function () {
        io.close();
        app.close();
    });

    it('can receive pushed data from a socket-io server', function (done) {

        browser.visit('http://localhost:5000')
            .then(function () {
                return browser.fire('#connect', 'mouseup');
            })
            .then(function () {
                serverSocket.emit('status', 'connected');
            })
            .then(function () {
                setTimeout(function () {
                    expect(browser.document.getElementById('status').innerHTML).toEqual('connected');
                    done();
                }, 100);
            })
            .then(function () { }, function (error) {
                expect(error.message).toEqual(null);
                done();
            });
    });
});
