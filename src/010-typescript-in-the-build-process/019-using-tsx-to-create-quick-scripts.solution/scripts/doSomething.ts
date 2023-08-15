console.log("The script is working!");

const [, , ...args] = process.argv;

console.log(args);
