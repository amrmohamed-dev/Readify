import mongoose from 'mongoose';

// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD,
// );
const DB = process.env.DATABASE_LOCAL;

const connection = () => {
  mongoose
    .connect(DB)
    .then(() => console.log('DB connection successfully'))
    .catch((err) => console.log('Connection failed:', err));
};

export default connection;
