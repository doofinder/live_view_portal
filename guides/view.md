# LiveView

The only special thing to do in the view module is the way of `using` LiveView:

```elixir
use MyAppWeb, {:live_view_portal, container: {:div, "data-app": "initial"}}
```

Here, the view container selector is declared as a `div` element that has an attribute `data-app` with value `"initial"`.
Also, as you may have noticed, we _use_ `live_view_portal`. Let's tweak our `MyAppWeb` module to support this.

## MyAppWeb

You need to `use LiveView` with at least one option. To make this possible, first you need to adapt the `__using__`
macro for the `MyAppWeb` module so you can accept a keyword list as second element of the tuple.

The default is:

```elixir
@doc """
When used, dispatch to the appropriate controller/live_view/etc.
"""
defmacro __using__(which) when is_atom(which) do
  apply(__MODULE__, which, [])
end
```

You can keep that and add one more clause to the macro:

```elixir
defmacro __using__({which, opts}) when is_atom(which) do
  apply(__MODULE__, which, [opts])
end
```

### New `live_view_portal` interface

If your Phoenix application will also hold regular LiveViews, you should create a new function only for using portals:

```elixir
def live_view_portal(opts \\ []) do
  opts = opts ++ [layout: {MyAppWeb.Layouts, :portal}]

  quote do
    use Phoenix.LiveView, unquote(opts)

    unquote(html_helpers())
  end
end
```

Finally, let's move on [the client side](js.md).
