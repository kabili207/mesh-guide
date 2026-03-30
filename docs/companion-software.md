# Companion Software

There's a growing assortment of software for communicating over the Reticulum network.
Below is a curated list of what I've personally used. My recommendation for desktop use
is MeshChatX and Columba on Android, but you're encouraged to try a few and see what fits.

## Sideband

**Platforms:** Android, Linux, macOS, Windows

The most full-featured option. Supports voice messaging, real-time calls, file attachments,
telemetry sharing, and a plugin system. Good choice if you want everything in one app.

[Home page](https://unsigned.io/sideband)

## MeshChatX

**Platforms:** Linux, macOS, Windows

A fork of MeshChat with voice calls, multi-identity handling, phonebook, contact sharing,
page archiving, integrated maps, and a more polished UI. Actively developed.

[Home page](https://meshchatx.com/) |
[Source code](https://git.quad4.io/RNS-Things/MeshChatX)

## MeshChat

**Platforms:** Linux, macOS, Windows

The original web-based client. Clean interface with a built-in NomadNet page browser,
image/file/voice support, and an optional local propagation node.

[Source code](https://github.com/liamcottle/reticulum-meshchat)

## Columba

**Platforms:** Android

A native Android client using Material Design. Still early in development but actively
maintained, and compatible with all other clients.

[Source code](https://github.com/torlando-tech/columba)

## Pyxis

**Platforms:** T-Deck Plus

An early project for a self-contained Reticulum node on the T-Deck, made by the same
person behind Columba. A bit slow at times, but the interface is clean. BLE transport is
buggy, though WiFi and LoRa work well. Audio calls are supported but the quality is low.

[Source code](https://github.com/torlando-tech/pyxis)

## Nomad Network

**Platforms:** Linux, macOS, Windows (terminal)

The original terminal-based client. Encrypted messaging, file sharing, and a built-in page
server for hosting NomadNet content. This is the reference implementation for the NomadNet
page ecosystem.

[Source code](https://github.com/markqvist/nomadnet)
