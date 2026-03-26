# LoRa Settings Comparison

If you're coming to Reticulum from Meshtastic or MeshCore, this page compares the LoRa radio
settings across all three to show how they differ.

All three use LoRa modulation with the same core parameters (spreading factor, bandwidth, and
coding rate) but they pick different defaults. Nodes on different platforms can't talk to each
other even if the radio parameters happen to match, since the protocols on top of LoRa are
different.

## Quick Reference

| Parameter | Effect of increasing |
|---|---|
| Spreading Factor (SF) | Longer range, slower speed |
| Bandwidth (BW) | Faster speed, shorter range, more noise susceptibility |
| Coding Rate (CR) | More error resilience, slightly slower speed |

## Meshtastic

Meshtastic uses named modem presets. The default is **Long Fast**.

| Preset | SF | CR | BW (kHz) |
|---|---|---|---|
| Short Turbo | 7 | 4/5 | 500 |
| Short Fast | 7 | 4/5 | 250 |
| Short Slow | 8 | 4/5 | 250 |
| Medium Fast | 9 | 4/5 | 250 |
| Medium Slow | 10 | 4/5 | 250 |
| Long Turbo | 11 | 4/8 | 500 |
| **Long Fast** (default) | **11** | **4/5** | **250** |
| Long Moderate | 11 | 4/8 | 125 |
| Long Slow | 12 | 4/8 | 125 |

Meshtastic also has 2.4 GHz (wide LoRa) variants of each preset with proportionally wider
bandwidths, for use with SX1280 hardware.

Meshtastic leans toward high spreading factors. The default Long Fast at SF11/BW250 prioritizes
range over throughput, and most meshes standardize on one preset across all nodes.

## MeshCore

MeshCore doesn't have named presets. You set the raw radio parameters directly. The community
maintains suggested regional configurations via the
[MeshCore config API](https://api.meshcore.nz/api/v1/config). The platform is currently
trending toward narrower bandwidth (BW 62.5 kHz) with lower spreading factors.

| Region | Freq (MHz) | SF | CR | BW (kHz) | Notes |
|---|---|---|---|---|---|
| USA/Canada | 910.525 | 7 | 4/5 | 62.5 | Recommended |
| EU/UK (Narrow) | 869.618 | 8 | 4/8 | 62.5 | Current recommendation |
| EU/UK (Deprecated) | 869.525 | 11 | 4/5 | 250 | Being phased out |
| Switzerland | 869.618 | 8 | 4/8 | 62.5 | |
| Czech Republic | 869.432 | 7 | 4/5 | 62.5 | |
| Portugal 868 | 869.618 | 7 | 4/6 | 62.5 | |
| Portugal 433 | 433.375 | 9 | 4/6 | 62.5 | |
| EU 433 MHz | 433.650 | 11 | 4/5 | 250 | Long range |
| Australia | 915.800 | 10 | 4/5 | 250 | |
| Australia (Narrow) | 916.575 | 7 | 4/8 | 62.5 | |
| Australia: SA, WA | 923.125 | 8 | 4/8 | 62.5 | |
| Australia: QLD | 923.125 | 8 | 4/5 | 62.5 | |
| New Zealand | 917.375 | 11 | 4/5 | 250 | |
| New Zealand (Narrow) | 917.375 | 7 | 4/5 | 62.5 | |
| Vietnam (Narrow) | 920.250 | 8 | 4/5 | 62.5 | |
| Vietnam (Deprecated) | 920.250 | 11 | 4/5 | 250 | Being phased out |

MeshCore is moving away from wide/high-SF settings toward narrow bandwidth (62.5 kHz) with
lower spreading factors (SF 7-8). This trades some raw range for a better noise floor,
improved SNR, and faster transmissions.

## Reticulum

Reticulum doesn't have presets. You configure each parameter individually in your
`~/.reticulum/config` file. There's no single "default" since the values depend on your
region and local mesh. See the [RNode page](rnode.md) for full regional configurations.

Common community settings from the
[Popular RNode Settings](https://github.com/markqvist/Reticulum/wiki/Popular-RNode-Settings) wiki:

| Region | Freq (MHz) | SF | CR | BW (kHz) |
|---|---|---|---|---|
| USA | 914.875 | 8 | 4/5 | 125 |
| EU (common) | 867.200 | 8 | 4/5 | 125 |
| UK | 867.500 | 9 | 4/5 | 125 |
| Australia | 925.875 | 9 | 4/5 | 250 |
| SE Asia | 920.500 | 8 | 4/5 | 125 |

Reticulum communities tend to land in the middle, around SF 8-9 with BW 125 kHz. Individual meshes
will deviate based on terrain and what works for them.

## Side by Side

| | Meshtastic | MeshCore | Reticulum |
|---|---|---|---|
| **Typical SF** | 11 (default) | 7–8 (trending) | 8–9 |
| **Typical BW** | 250 kHz | 62.5 kHz (trending) | 125 kHz |
| **Typical CR** | 4/5 | 4/5 to 4/8 | 4/5 |
| **Configuration** | Named presets | Raw parameters | Raw parameters |
| **Philosophy** | Range first | Speed/efficiency first | Balanced |

## Notes

- **No cross-platform communication.** Even with identical radio settings, Meshtastic, MeshCore,
  and Reticulum use different protocols and won't talk to each other.
- **Bandwidth affects duty cycle.** In regions with duty cycle limits (like Europe), narrower
  bandwidth means each transmission takes longer, eating into your allowed airtime faster
  despite the lower data rate.
- **Match your local mesh.** Whatever platform you're on, the most important thing is using the
  same settings as the people you want to talk to. Check with your local community.
