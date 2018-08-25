const { always: K, compose, objOf, path } = require('ramda')
const http    = require('http')
const request = require('supertest')

const assertBody              = require('./lib/assertBody')
const { json, mount, routes } = require('..')

describe('routes', () => {
  const app = routes({
    '/users':     K(json([])),
    '/users/:id': compose(objOf('body'), path(['params', 'id']))
  })

  const server = http.createServer(mount(app)),
        agent  = request.agent(server)

  it('routes to handler matching the request url', () =>
    agent.get('/users').expect(200, [])
  )

  it('parses the route params for matched routes', () =>
    agent.get('/users/bob').expect(200).then(assertBody('bob'))
  )

  it('404 Not Founds for unmatched routes', () =>
    agent.get('/not-found').expect(404)
  )
})
