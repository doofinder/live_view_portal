defmodule LiveViewPortal.MixProject do
  use Mix.Project

  @source_url "https://github.com/doofinder/live_view_portal"
  # The version is the same as the one in package.json
  @version "0.1.4-lv1.0.2"

  def project do
    [
      app: :live_view_portal,
      version: @version,
      elixir: "~> 1.17",
      start_permanent: Mix.env() == :prod,
      deps: deps(),
      aliases: aliases(),
      # Hex
      description: "Embed LiveViews in web pages",
      # Docs
      name: "LiveViewPortal",
      docs: docs()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:ex_doc, ">= 0.0.0", only: :dev, runtime: false},
      {:ecto_sql, "~> 3.10"},
      {:esbuild, "~> 0.8", runtime: Mix.env() == :dev},
      {:makeup_syntect, "~> 0.1.0", only: :dev, runtime: false},
      {:phoenix, "~> 1.7.14"},
      {:phoenix_ecto, "~> 4.5"},
      {:phoenix_html, "~> 4.1"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix_live_view, "== 1.0.2"},
      {:phoenix_live_dashboard, "~> 0.8.3"},
      {:postgrex, ">= 0.0.0"},
      {:tailwind, "~> 0.2", runtime: Mix.env() == :dev}
    ]
  end

  defp aliases do
    builders =
      Enum.map(
        ["lv_module", "module", "cdn", "cdn_min"],
        &("esbuild " <> &1)
      )

    [
      "assets.build": builders,
      "assets.watch": builders |> Enum.map(&(&1 <> " --watch"))
    ]
  end

  defp docs do
    [
      main: "overview",
      extras: extras(),
      groups_for_extras: groups_for_extras(),
      source_url: @source_url
    ]
  end

  defp extras do
    [
      "guides/overview.md",
      "guides/router.md",
      "guides/endpoint.md",
      "guides/view.md",
      "guides/js.md",
    ]
  end

  defp groups_for_extras do
    [Introduction: ~r/guides\/.?/]
  end

end
