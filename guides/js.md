# Client side

## Imports

You can clone the repo and run the following to get the bundled library:

```bash
npm install && npm assets:build:dev
```

Then, to import it into your project you can copy the built asset and reference to it.

```javascript
import { LivePortal, deadMount } from "./live_view_portal.js";
```

## LivePortal

To make things simpler, in this example we will hold the LivePortal object in a top level variable. You probably won't
do this for production, where you can abstract it the way you prefer. We also need to keep the url where the LiveView is
served.

```javascript
let livePortal;
const lvUrl = "http://localhost:9823/embed/initial";
``` 

### deadMount

`deadMount` is the first http request that is made to a LiveView. It serves two purposes:

- **SEO**. Search engine crawlers can see your LiveView html. If this is a requirement for your app, you should perform
  the `deadMount` on page load.
- **CSRF token**. The html response includes an element with the anti-CSRF token. This is used by LiveView to authorize
  the socket connection.

### `new LivePortal`

The first argument that the `LivePortal` constructor expects is the result of `deadMount`. Then, you can define:

- `appName`: mirrors the `data-app` attribute we defined back in the [LiveView](view.html).
- [`hooks`][1] 
- `lvUrl`. (defined above) 
- `socketUrl`. `Phoenix.Endpoint.socket/3` full url.

For more information, you can check the `LivePortal` documentation in [its implementation][2].

```javascript
const mountPoint = await deadMount(lvUrl, "initial");
livePortal = new LivePortal(mountPoint.shadowRoot, {
  appName: "initial",
  hooks: Hooks,
  lvUrl,
  socketUrl: "http://localhost:9823/live"
});
```

## `LivePortal.connect`

Once the `LivePortal` object is created, you can connect to the socket when your application wants to do so.

```javascript
livePortal.connect();
```

The `connect()` method accepts a callback.

## Wrapping up

This is the minimum bits that you need to implement your own LiveViewPortal! If you have any doubts, you can check the 
[repo][3] and the [client side code][2], where there is some more documentation. 

## Example

A full example for a widget app that can be opened and closed, with a hook.

```javascript
import { LivePortal, deadMount } from "./live_view_portal.js";

/**
 * @type {Object.<string, import("phoenix_live_view").ViewHook>}
 */
let Hooks = {}
Hooks.Closer = {
  mounted() {
    this.handleEvent("close-initial", () => {
      close();
    })
  }
}

// This file will be executed from a script tag.
// The script creates a trigger button with a click
// eventListener. When the event is fired, performs double mount.

const lvUrl = "http://localhost:9823/embed/initial";
let livePortal;

function setup() {
  let trigger = document.createElement('div');
  trigger.id = "initial-trigger"; 
  trigger.innerHTML = "<h4>Push me</h4>";

  trigger.addEventListener("click", async () => {
    const mountPoint = await deadMount(lvUrl, "initial");
    livePortal = new LivePortal(mountPoint.shadowRoot, {
      appName: "initial",
      hooks: Hooks,
      lvUrl,
      socketUrl: "http://localhost:9823/live"
    });

    livePortal.connect(() => {});
    trigger?.setAttribute("hidden", "");
    document.body.append(mountPoint);
  });

  document.body.append(trigger);
}

function close() {
  if (!livePortal) {
    console.error("Can't close portal because it is not connected.");
    return;
  }

  livePortal.disconnect(() => {
    const mount = document.getElementById("initial");
    mount?.remove();
    const trigger = document.getElementById("initial-trigger");
    trigger?.removeAttribute("hidden");
  });
}

setup();
```


[1]: https://hexdocs.pm/phoenix_live_view/js-interop.html#client-hooks-via-phx-hook
[2]: https://github.com/doofinder/live_view_portal/blob/master/assets/js/live_view_portal/portal.js
[3]: https://github.com/doofinder/live_view_portal
