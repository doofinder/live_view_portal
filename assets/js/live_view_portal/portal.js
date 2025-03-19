import "phoenix_html";
import { Socket } from "phoenix";
import { LiveSocket } from "live_view_portal/live_view";

/** Wrapper around LiveSocket that makes LiveView embeddable in third party
 * websites.
 */
export class LivePortal {
  /** Initializes the LivePortal.
   *
   * @param {Element} root - The root element where the LiveView is mounted.
   * For shadow DOM this should be a ShadowRoot, for regular DOM this should be
   * an HTMLElement. The first *dead* mount has to be already executed using
   * `deadMount`.
   *
   * @param {Object} [opts] - Optional configuration. Outside of keys listed
   * below, all configuration is passed directly to the LiveSocket constructor.
   *
   * @param {boolean} [opts.useShadowDOM=true] - Whether to use Shadow DOM (true)
   * or regular DOM (false) for isolation.
   *
   * @param {Object} [opts.extraParams] - Socket extra connection params. They
   * will be available in `mount/3` under `socket.private.connect_params`, only
   * for the *live* mount.
   *
   * @param {string} [opts.lvUrl] - Portal LiveView full route url.
   * For example:
   *
   *    'https://lv-server.com/embed/app'
   *
   *    In that case, the router would have the following:
   *
   *     *my_app/lib/myapp_web/router.ex*
   *     ```elixir
   *      scope "/embed", MyAppWeb do
   *        pipe_through :embed
   *
   *        live "/app", Live.AppLive
   *      end
   *     ```
   *
   * @param {string} [opts.socketUrl] - The LiveView socket url as defined
   * in the server. For example:
   *
   *     lvUrl = 'wss://my-app-server.com/live'
   *
   *     *my_app/lib/myapp_web/endpoint.ex*
   *     ```elixir
   *     socket "/live", Phoenix.LiveView.Socket, websocket: true
   *     ```
   *
   * @param {string} [opts.appName] -  The name of the portal app. Expected to
   * match the LiveView container `data-app` attribute. For example:
   *     appName = "initial"
   *
   *
   *     *my_app/lib/myapp_web/live/app_live.ex*
   *     ```elixir
   *     use Phoenix.LiveView, container: {:div, "data-app": "initial"}
   *     ```
   *
   */
  constructor(root, opts) {
    if (!root) {
      throw new Error(
        `Root element is invalid: ${root}. Use deadMount before creating a LivePortal.`,
      );
    }

    // Validate root element matches useShadowDOM setting
    opts.useShadowDOM = opts.useShadowDOM !== false; // Default to true
    if (opts.useShadowDOM && !(root instanceof ShadowRoot)) {
      throw new Error("When useShadowDOM is true, root must be a ShadowRoot.");
    }
    if (!opts.useShadowDOM && root instanceof ShadowRoot) {
      throw new Error(
        "When useShadowDOM is false, root must not be a ShadowRoot.",
      );
    }

    const csrfTokenElement = root.querySelector("meta[itemprop='csrf-token']");
    if (!csrfTokenElement) {
      throw new Error("CSRF token not found in the provided root element.");
    }
    const csrfToken = csrfTokenElement.getAttribute("content");

    opts = {
      externalHref: opts.lvUrl,
      rootViewSelector: `[data-app='${opts.appName}']`,
      params: { _csrf_token: csrfToken, ...opts.extraParams },
      domRoot: root,
      ...opts,
    };

    this.liveSocket = new LiveSocket(opts.socketUrl, Socket, opts);
    this.connected = false;
  }

  /**
   * Connect the portal and socket.
   *
   * @param {function} callback - Function executed after connection is
   * established.
   */
  connect(callback) {
    if (this.connected) {
      console.warn("LivePortal is already connected.");
      return;
    }

    this.liveSocket.connect();
    this.connected = true;
    callback && callback();
  }

  /**
   * Disconnect the portal and socket.
   *
   * @param {function} callback - Function executed after the socket is
   * disconnected.
   */
  disconnect(callback) {
    if (!this.connected) {
      console.warn("LivePortal is not connected.");
      return;
    }

    this.liveSocket.unload(callback);
    this.connected = false;

    console.log("LivePortal disconnected.");
  }
}

/** Performs the first *dead* LiveView mount.
 *
 * @param {URL} url - LiveView server endpoint url.
 * @param {string} appName - Used to create the mountpoint element id.
 * @param {boolean} [useShadowDOM=true] - Whether to use Shadow DOM for isolation.
 * @returns {HTMLElementDiv} The LV mount point. It is not appended to the DOM.
 */
export async function deadMount(url, appName, useShadowDOM = true) {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`Failed to load app: ${response.statusText}`);
  }

  const htmlString = await response.text();
  let mountpoint = document.createElement("div");
  mountpoint.id = appName;

  if (useShadowDOM) {
    let shadowRoot = mountpoint.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = htmlString;
  } else {
    mountpoint.innerHTML = htmlString;
  }

  return mountpoint;
}
