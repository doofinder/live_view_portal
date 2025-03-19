# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.4-lv1.0.2] - 2025-03-18

### Changed

- Change expected element containing CSRF token to `<meta>`. [`6492048`](https://github.com/doofinder/live_view_portal/commit/6492048bcca7c6a6c204a13eb5275b0b49ff4527)
- Fix [`Phoenix.LiveView.JS`](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.JS.html) commands. [`7df484b`](https://github.com/doofinder/live_view_portal/commit/7df484b61b95636754544b88be080cb27225189f)

## [0.1.3-lv1.0.2] - 2025-02-27

### Changed

- Prepare NPM package. No logic changes. [`abcad2a`](https://github.com/doofinder/live_view_portal/commit/abcad2a09867b30c5bccd8592638afab456225c2) 

## [0.1.2-lv1.0.2] - 2025-02-12

### Changed

- Make shadow DOM optional. [`c3c917e`](https://github.com/doofinder/live_view_portal/commit/c3c917e141b341c52a85e7beb3551d56818593ad)

## [0.1.1-lv1.0.2] - 2025-02-11

### Changed

- Improve documentation. [`bc681b6`](https://github.com/doofinder/live_view_portal/commit/bc681b691f16848f4a7d3db21ea0067403a3c99f)

### Fixes

- Fix `LivePortal.connect` when no callback is passed. [`f9dc867`](https://github.com/doofinder/live_view_portal/commit/f9dc867eaa45bcac2684f0aa8316f58b14bdf3f3)
- Add cors mode for dead mount. [`8c8ea71`](https://github.com/doofinder/live_view_portal/commit/8c8ea714063ef27db7194138287114b9f76b9158)

## [0.1.0-lv1.0.2] - 2025-01-29

### Changed

- Made API simpler, exposing `LivePortal` and `deadMount`. [`f386b56`](https://github.com/doofinder/live_view_portal/commit/f386b56a433a59191dfc846f88aa213cef14cc10)
- Bump LiveView to `1.0.2`, adapting changes as needed. [`f74c238`](https://github.com/doofinder/live_view_portal/commit/f74c23864963ff75b60b9fac03fe4c2328deaa80)
