const { Server } = require('socket.io');

// NOTE: you should not use a wildcard CORS config in production.
// configure this properly for your needs.
const io = new Server(process.env.PORT || 3000, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let counter = 0;

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
