# LiveViewPortal

Embed [`LiveView`][1]s in web pages through `LivePortal`s.

## Usage

This library is bundled as a module and you can just include it in your portal's bundle.

By default, portal uses a shadow DOM. You can disable it by setting `useShadowDOM` to `false`
in the `deadMount` function and the `LivePortal` class.

### Development

1. Run `npm run build` to bundle js.
2. Copy the built file from `assets/js/dist/live_view_portal.js` to your LiveView app under `assets/vendor`.
3. `import ../vendor/live_view_portal.js`.

## Deploy

When a new version is ready, follow these steps:

1. Make sure all references to the version in the code and docs are updated.
2. Create a lightweight `git tag` and push it:

```bash
git tag v0.1.0-lv1.0.2
git push --tags
```

## Architecture

### Elixir

LiveViewPortal's server side code is the same as Phoenix.LiveView. No Hex package is distributed for now. If in the
future we need to modify elixir code, we can publish it on Hex. Then LiveViewPortal would be introduced as a dependency
in the place of Phoenix.LiveView.
For now this project is pure JS.

### Javascript

LiveViewPortal introduces changes to LiveView code on the javascript side. It also exposes an API to create portals and
connect to the underlying LiveView.

## LiveView modifications

### Files

Files inside `assets/phoenix_live_view/js/`:

- `dom.js`
- `dom_patch.js`
- `dom_post_morph_restorer.js`
- `js.js`
- `live_socket.js`
- `view.js`
- `view_hook.js`

## Versioning

### Versioning Strategy

We have decided to adopt the following versioning format: **X.X.X-lvY.Y.Y**, where:

- **X.X.X** represents the application version.
- **lvY.Y.Y** indicates the LiveView version.

#### Version Increment Rules

- **Minor Version Updates**: If the LiveView version is upgraded within its minor version (e.g., from 1.5.0 to 1.5.1), we will increment the minor version of our app.

- **Major Version Updates**: If the LiveView version is upgraded within its major version (e.g., from 1.5.0 to 2.0.0), we will increment the major version of our app.

## Docs

Documentation can be generated with [ExDoc](https://github.com/elixir-lang/ex_doc)
and published on [HexDocs](https://hexdocs.pm). Once published, the docs can
be found at <https://hexdocs.pm/live_view_portal>.

[1]: https://github.com/phoenixframework/phoenix_live_view
