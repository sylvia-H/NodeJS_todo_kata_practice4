const http = require('http');
const { v4: uuidv4 } = require('uuid');
const headers = require('./conf/headers');
const successHandler = require('./handlers/sucessHandlers');
const errorHandler = require('./handlers/errorHandlers');
const todos = [];

const requestListener = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  const condition_url_1 = req.url === '/todos4';
  const condition_url_2 = req.url.startsWith('/todos4/');

  if (condition_url_1) {
    switch (req.method) {
      case 'GET':
        successHandler(res, todos);
        break;

      case 'POST':
        req.on('end', () => {
          try {
            const title = JSON.parse(body).title;
            if(title !== undefined) {
              const todo = {
                id: uuidv4(),
                title,
              };
              todos.push(todo);
              successHandler(res, todos);
            } else {
              errorHandler(res, 400, 4001);
            }
          } catch (error) {
            errorHandler(res, 400, 4002);
          }
        });
        break;
      
      case 'DELETE':
        todos.length = 0;
        successHandler(res, todos);
        break;
      
      case 'OPTIONS':
        res.writeHead(200, headers);
        req.end();
        break;
        
      default:
        errorHandler(res, 405);
        break;
    }
  } else if (condition_url_2) {
    switch (req.method) {
      case 'DELETE':
        try {
          const id = req.url.split('/').pop();
          const index = todos.findIndex((el) => el.id === id);
          if(index !== -1) {
            todos.splice(index, 1);
            successHandler(res, todos);
          } else {
            errorHandler(res, 400, 4003);
          }
        } catch (error) {
          errorHandler(res, 400, 4002)
        }
        break;
      
      case 'PATCH':
        req.on('end', () => {
          try {
            const id = req.url.split('/').pop();
            const index = todos.findIndex((el) => el.id === id);
            const title = JSON.parse(body).title;
            if(index !== -1 && title !== undefined) {
              todos[index].title = title;
              successHandler(res, todos);
            } else {
              errorHandler(res, 400, 4003)
            }
          } catch (error) {
            errorHandler(res, 400, 4002)
          }
        })
        break;
        
      default:
        errorHandler(res, 405);
        break;
    }

  } else {
    errorHandler(res, 404);
  }
  
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
