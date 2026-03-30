# Reticulum Interface Modes

!!! warning ""
    Interface modes only matter if you're running a **Transport Node**. If you're not, leave everything at the default and ignore this page.

`full` *(default)*
:   Full participation in discovery, meshing, and transport. Use this when your node lives on a
    single medium and you don't need anything special.

`gateway` *(shorthand: gw)*
:   Everything `full` does, plus your node will proactively resolve unknown paths on behalf of
    connected clients. Use this on the **client-facing** interface of a hub or gateway node, i.e.
    the interface your users connect *to*, not the uplink side.

    `gateway` and `full` behave identically for announce propagation. The only difference is
    that proactive path lookup.

`access_point` *(shorthand: ap)*
:   The interface stays quiet and won't broadcast announces automatically. Paths expire faster.
    Path requests are still handled like `gateway`. Best for wide-area RF interfaces where users
    pop on briefly and then disappear.

`roaming`
:   For physically mobile interfaces, from the perspective of the wider network. Use on the
    **external** radio of a mobile node (vehicle, phone, etc.). Paths expire faster to account
    for movement.

`boundary`
:   Marks an interface that bridges to a **significantly different** network segment. The classic
    example: a node with both a LoRa RF mesh *and* an internet TCP uplink. Set the internet-facing
    interface to `boundary` so Reticulum manages announce flow carefully and your fast internet
    side doesn't flood your slow RF side.

    This is not about blocking traffic. It's a flow management hint.

## Quick Reference

| Use case | Mode |
|---|---|
| Client-facing interface on a hub/gateway | `gateway` |
| Internet uplink on a node with LoRa/RF | `boundary` |
| Wide-area RF with transient users | `access_point` |
| External radio on a mobile/vehicle node | `roaming` |
| Everything else | `full` (default) |
