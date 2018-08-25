const {
  assoc, cond, evolve, flip, is, merge, pick, pipe, prop, T, when
} = require('ramda')

const json = require('./json')

const configError = ({ output: { payload, statusCode } }) =>
  merge(json(payload), { statusCode })

const setupError = err =>
  pipe(
    cond([
      [ prop('isBoom'), configError   ],
      [ prop('isJoi'),  joiError    ],
      [ T,              systemError ]
    ]),
    evolve({ headers: flip(merge)(err.headers) })
  )(err)

const joiError = pipe(
  pick(['details', 'message', 'name']),
  json,
  assoc('statusCode', 400)
)

const systemError = ({ message, name, statusCode=500 }) =>
  merge(json({ message, name }), { statusCode })

module.exports = when(is(Error), setupError)
