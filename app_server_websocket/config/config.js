const config = {
  db: {
    database: "Monopoly",
    colUsers: "users",
    uri: "mongodb+srv://usuario:REuosfhhCZY0IvN3@ps-monopoly.uu23g8z.mongodb.net/Monopoly",
    //uri : "mongodb://admin:admin@172.22.0.2:27017/Monopoly"
    dbOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true
       ,maxPoolSize : 10 // Tamaño de la piscina
    }
  },
};
module.exports = config;



