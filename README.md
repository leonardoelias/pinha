<div align="center">

[![Pinha Server framework](./.github/logo.png)](https://devparana.org)

Simple node.js server framework, plug and play.

</div>


## Motivation

The main goal of `pinha` is to make building a `node.js` server easy, without all of the configuration or imperative boilerplate required for other server frameworks.  If you prefer to build apps with function composition or even a point-free style, then `pinha` is for you.

With `pinha` you get all of these out-of-the-box:

- Pure, functional and Promise-based
- Plug-n-play
- Composeable json
- Routing functions
- Several common
- Json-formatted
- CORS support

Let's try a quick Hello World example server.  It accepts a `:name` param in the url, and then includes that name in the `json` response body.

```js
const http = require('http')
const { compose } = require('ramda')
const { json, logger, methods, mount, routes } = require('pinha')

const hello = req => ({
  message: `Hello ${req.params.name}!`
})

const app = routes({
  `/hello/:name`: methods({
    GET: compose(json, hello)
  })
})

const opts = { errLogger: logger, logger }

http.createServer(mount(app, opts)).listen(3000, logger)
```

