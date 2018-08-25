const {
  always, both, cond, equals, flip, is,
  lensProp, merge, over, pathOr, T, test
} = require('ramda')

const config = {
  credentials: 'true',
  headers: 'content-type',
  methods: 'GET,POST,OPTIONS,PUT,PATCH,DELETE',
  origin: '*'
}

const access = (opts, req) => ({
  'access-control-allow-credentials': opts.credentials || config.credentials,
  'access-control-allow-origin': chooseOrigin(opts.origin || config.origin, pathOr('', ['headers', 'origin'], req))
})

const cors = (app, opts={}) => req =>
  Promise.resolve(req)
    .then(req.method === 'OPTIONS' && options(opts) || app)
    .then(over(lensProp('headers'), merge(access(opts, req))))
    .catch(corsifyError(opts, req))

const corsifyError = (opts, req) => err => {
  throw Object.assign(err, { headers: access(opts, req) })
}

const chooseOrigin = (allowed, origin) =>
  cond([
    [equals('*'), always('*')],
    [equals(true), always(origin)],
    [both(is(RegExp), flip(test)(origin)), always(origin)],
    [T, always('false')],
  ])(allowed)

const options = opts => ({ headers }) => ({
  headers: {
    'access-control-allow-headers': opts.headers || headers['access-control-request-headers'] || config.headers,
    'access-control-allow-methods': opts.methods || headers['access-control-request-method'] || config.methods
  },
  statusCode: 204
})

module.exports = cors
