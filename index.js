const io = require("socket.io")(8900, {
    cors: {
        origin: "*",
    },
});

let users = [];

const addUser = (userId, socketId) => {
    console.log("1");
    !users.some((user) => user.userId == userId) &&
        users.push({ userId, socketId });
    console.log(users);
};

const removeUser = (socketId) => {
    console.log("2");
    users = users.filter((user) => user.socketId != socketId);
    console.log(users);
};

const getUser = (userId) => {
    console.log("3");
    const term = users.find((user) => user.userId == userId);
    console.log("sad", term);
    return term;
    // user.userId === userId);
};

io.on("connection", (socket) => {
    //when connect
    console.log("a user connected.");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        // console.log("add user", userId);
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //send and get message
    socket.on(
        "sendMessage",
        ({ senderId, receiverId, message, messageType }) => {
            // console.log(receiverId);
            const user = getUser(receiverId);
            console.log("find user", user?.socketId);
            io.to(user?.socketId).emit("getMessage", {
                senderId,
                message,
                messageType,
            });
        }
    );

    // //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });

    // socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    //     const user = getUser(receiverId);
    //     io.to(user.socketId).emit("getMessage", {
    //         senderId,
    //         text,
    //     });
    // });
});
