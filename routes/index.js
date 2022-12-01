const users = require('./users');

const configRoutes = (app) => {
    app.use('/users', users);
    app.use('*', (req, res) => {
        res.status(404).json({ 
          error: 'Not found' 
        });
    });
}

module.exports ={configRoutes}