# Endpoint security

The LiveView endpoint must be reachable from cross-site origins. This requires the application to check the request
origin. Also, we need to use the defaults that liveview provides us to use an anti-CSRF token. Under the hood, Phoenix
uses `Plug.CSRFProtection`.

## Session

In this case, we use a session cookie. These are the options:

```elixir
@session_options [
  store: :cookie,
  key: "_test_lv_key",
  signing_salt: "p7w6gssN",
  secure: true,
  same_site: "None; Secure",
  extra: "Partitioned"
]
```

Because we need the browser to send the cookie on cross-site requests — requests that will hit our server — we set the
following options: 

- `secure: true`. 
- `same-site: "None; Secure"`
- `extra: "Partitioned"`. Some [links][1] to [read][2] on [this][3].

At the time of writing this, `Partitioned` is not yet fully [supported][4] across all browsers, but Chrome warns that it will
be a requirement in the future.

## CORS plug

You can use an existing plug library for this like `Corsica` or roll out your own plug. Let's see how we could use Corsica:

```elixir
@allowed_origins ["http://localhost:9898", "https://myfirstclient.com"]

# This plug has to be defined before any Plug.Static or MyAppWeb.Router
plug Corsica, 
  origins: @allowed_origins,
  allow_methods: ["GET"],
  allow_headers: :all,
  allow_credentials: true
```

This will check only HTTP requests. Sockets have to check the origin on their own.

You can define a list of allowed origins. 

> #### Tip {: .tip}
>
> In your app case, you probably want to check the origin depending on some other connection info. You are highly
> encouraged to implement your own `Plug`. That way you can make it check HTTP requests and also socket connections.   

## Socket

Here you can just use the normal `Phoenix.LiveView.Socket`. Reusing the origins already defined above, use them for the 
`check_origin` option.

See the [common configuration][5] for all transports for more info on the `check_origin` option. As noted before, when
your app grows complex just implement your own plug to have all information that you need available.

```elixir
socket "/live", Phoenix.LiveView.Socket,
  websocket: [
    check_origin: @allowed_origins,
    connect_info: [session: @session_options],
    log: :debug
  ]
```

We are now ready to [implement our view](view.html).


[1]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#partitioned
[2]: https://developer.mozilla.org/en-US/docs/Web/Privacy/Privacy_sandbox/Partitioned_cookies
[3]: https://developers.google.com/privacy-sandbox/cookies/chips
[4]: https://developer.mozilla.org/en-US/docs/Web/Privacy/Privacy_sandbox/Partitioned_cookies#browser_compatibility
[5]: https://hexdocs.pm/phoenix/Phoenix.Endpoint.html#socket/3-common-configuration
