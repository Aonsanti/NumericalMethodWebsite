const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Nodejs + MySQL API',
    description: 'Nodejs + MySQL API',
  },
  host: 'localhost:8080',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointFiles, doc).then(()=>{
    require('./server.js');
});
