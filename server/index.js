const { createServer } = require('http');
const { Server } = require('socket.io');

let counter = 0;

const httpServer = createServer((req, res) => {
  if (req.url !== '/') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  
  const content = JSON.stringify({ "text": "The count is " + counter});
  const length = Buffer.byteLength(content);

  res.writeHead(200, {
    'Content-Type': 'text',
    'Content-Length': length,
    // NOTE: you should not use a wildcard CORS config in production.
    // configure this properly for your needs.
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
    'Access-Control-Max-Age': 2592000,
  });
  res.end(content);
});

// NOTE #1: you should not use a wildcard CORS config in production.
// configure this properly for your needs.
// NOTE #2: using node's http server with socket.io, you need to 
// have a CORS config for each.
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// io.on('connection', ...) is the default handler for when a browser
// makes a connection to the server. Inside of the connection event
// is where we register the handlers for the individual events the
// client and server send around.
io.on('connection', (socket) => {
  // Log a connection id every time a new client connection is made.
  console.log(`connect ${socket.id}`);

  // Tell the client (by emitting to the client) that the connection
  // was successful.
  socket.emit('connectionSuccess', true);

  // sendData is the eventname for when the client submits to the
  // server. In this example, we take the data, decorate it a bit,
  // and send it back.
  socket.on('sendData', (arg) => {
    console.log('Data was sent to me: ' + arg);
    socket.emit(
      'update',
      "Hi from the server! I was sent '" +
        arg +
        "' that was the " +
        counter++ +
        "th message I've received."
    );
  });
});

httpServer.listen(process.env.PORT || 3000);
