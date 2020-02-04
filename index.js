const db = require('./db');
const fastify = require('fastify')({logger: true});
const uuidv1 = require('uuid/v1');

fastify.register(require('fastify-cors'), {
    origin: true
});

fastify.post('/api/login', async (request, reply) => {
    const user = db.get('users')
        .find(request.body)
        .value();

    if (user) {
        return {};
    } else {
        reply
            .code(401)
            .send({ message: 'incorrect login or password'});
    }
});

fastify.get('/api/courses', async () => {
    return db.get('courses')
        .value();
});

fastify.get('/api/courses/:id', async (request, reply) => {
    const course = db.get('courses')
        .find({ id: request.params.id })
        .value();

    if (course) {
        return course;
    } else {
        reply
            .code(404)
            .send({ message: 'not found'});
    }
});

fastify.post('/api/courses', async (request) => {
    const course = { id: uuidv1(), ...request.body };

    db.get('courses')
        .push(course)
        .write();

    return course;
});

fastify.put('/api/courses/:id', async (request, reply) => {
    const findChain = db.get('courses')
        .find({ id: request.params.id });

    if (findChain.value()) {
        return findChain
            .assign(request.body)
            .write();
    } else {
        reply
            .code(404)
            .send({ message: 'not found'});
    }
});

fastify.delete('/api/courses/:id', async (request, reply) => {
    const removed = db.get('courses')
        .remove({ id: request.params.id })
        .write();

    if (removed.length) {
        return {};
    } else {
        reply
            .code(404)
            .send({ message: 'not found'});
    }
});

fastify.get('/api/authors', async () => {
    return db.get('authors')
        .value();
});

const start = async () => {
    try {
        await fastify.listen(3001);
        fastify.log.info(`server listening on ${fastify.server.address().port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();