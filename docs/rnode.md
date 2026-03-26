# Setting up an RNode

RNodes are radio-based hardware that let Reticulum communicate over LoRa without the internet.
This is the off-grid part of mesh networking.

## Prerequisites

Before setting up an RNode, make sure you have [Reticulum installed and configured](reticulum.md).

## Hardware

RNode firmware supports boards with Semtech SX1276, SX1278, SX1262, SX1268, or SX1280 LoRa
chips. The chipset determines your max transmit power and which frequency bands you can use:

| Chipset | Max TX Power | Typical Bands | Notes |
|---|---|---|---|
| SX1276 / SX1278 | 17 dBm | 868 MHz, 915 MHz | Older, widely available |
| SX1262 / SX1268 | 22 dBm | 868 MHz, 915 MHz | Newer, higher power and better sensitivity |
| SX1280 | 12 dBm | 2.4 GHz | Much faster, but shorter range |

Here are some commonly used boards grouped by chipset. Many come in multiple variants, so
check the product listing to confirm which chip and frequency band yours uses.

### SX1276 / SX1278 Boards

The most common and affordable options. Fine for most setups, but capped at 17 dBm transmit
power.

- **LilyGO T-Beam v1.1**: includes GPS and an 18650 battery holder
- **LilyGO LoRa32 v1.0 / v2.0 / v2.1**: compact, with a built-in OLED display
- **Heltec LoRa32 v2**: similar to the LilyGO LoRa32, also has an OLED

### SX1262 / SX1268 Boards

Higher transmit power (up to 22 dBm) and generally better receive sensitivity. Worth it if
you need extra range or your mesh uses higher TX power settings.

- **LilyGO T-Beam v1.1 (SX1262 variant)**: same form factor as the SX1276 version
- **LilyGO T-Beam Supreme**: upgraded T-Beam
- **LilyGO T3S3 (SX1262 variant)**: ESP32-S3 based
- **Heltec LoRa32 v3 / v4**: newer Heltec boards
- **RAK4631**: nRF52840 based, low power draw
- **Heltec T114**: compact nRF52840 board

### SX1280 Boards (2.4 GHz)

Operates on 2.4 GHz instead of sub-GHz. Much faster, but the range drops off
significantly. Best for high-bandwidth links between nearby nodes.

- **LilyGO T3S3 (SX1280 variant)**

For a full and up-to-date list, see the
[RNode Firmware repository](https://github.com/markqvist/RNode_Firmware).

## Flashing Firmware

TODO

## Configuring

Once your RNode is flashed and connected, add it as an interface in your Reticulum config
at `~/.reticulum/config`.

The parameters you'll need to set:

| Parameter | Description | Notes |
|---|---|---|
| `frequency` | Carrier frequency in Hz | must comply with your local ISM band |
| `bandwidth` | Channel bandwidth in Hz | common values: 62500, 125000, 250000, 500000 |
| `txpower` | Transmit power in dBm | limited by hardware and local regulations |
| `spreadingfactor` | LoRa spreading factor (7–12) | higher means longer range but slower speed |
| `codingrate` | Forward error correction rate (5–8) | higher means more error resilience |

`frequency`, `bandwidth`, and `spreadingfactor` must be identical on all nodes that need to
communicate. `txpower` and `codingrate` can differ between nodes.

As a rough guide:

- **Short range, fast:** sf=7, bw=250000 or 500000
- **Balanced (most common):** sf=8, bw=125000
- **Long range, slow:** sf=9–12, bw=62500–125000

### Regional Configurations

Your frequency and power settings depend on your country's radio regulations. Here are common
configurations for each major region. The [Popular RNode Settings](https://github.com/markqvist/Reticulum/wiki/Popular-RNode-Settings) wiki has more community-maintained configs.

=== "North America"

    Applies to the United States, Canada, Mexico, and most of Central America and the Caribbean.

    Max legal power is 30 dBm EIRP. No duty cycle limits, but FCC Part 15 rules apply.

    ```ini
    [[RNode LoRa Interface]]
      type = RNodeInterface
      enabled = yes
      port = /dev/ttyUSB0
      frequency = 914875000
      bandwidth = 125000
      txpower = 17
      spreadingfactor = 8
      codingrate = 5
    ```

=== "Europe"

    Applies to EU countries, UK, Switzerland, Norway, Iceland, Turkey, and much of Africa.

    Max legal power is 16 dBm EIRP. Europe also enforces a 1% duty cycle, so keep this in mind
    for high-traffic links.

    ```ini
    [[RNode LoRa Interface]]
      type = RNodeInterface
      enabled = yes
      port = /dev/ttyUSB0
      frequency = 867200000
      bandwidth = 125000
      txpower = 7
      spreadingfactor = 8
      codingrate = 5
    ```

=== "Australia / New Zealand"

    Also used in Argentina, Brazil, Chile, Ecuador, Paraguay, and Peru.

    Max legal power is 30 dBm EIRP.

    ```ini
    [[RNode LoRa Interface]]
      type = RNodeInterface
      enabled = yes
      port = /dev/ttyUSB0
      frequency = 925875000
      bandwidth = 250000
      txpower = 17
      spreadingfactor = 9
      codingrate = 5
    ```

=== "India"

    Max legal power is 30 dBm EIRP. 1% duty cycle applies.

    ```ini
    [[RNode LoRa Interface]]
      type = RNodeInterface
      enabled = yes
      port = /dev/ttyUSB0
      frequency = 865200000
      bandwidth = 125000
      txpower = 17
      spreadingfactor = 8
      codingrate = 5
    ```

=== "China"

    Max legal power is 19 dBm.

    ```ini
    [[RNode LoRa Interface]]
      type = RNodeInterface
      enabled = yes
      port = /dev/ttyUSB0
      frequency = 470300000
      bandwidth = 125000
      txpower = 17
      spreadingfactor = 9
      codingrate = 5
    ```

=== "Japan"

    Max legal power is 13 dBm.

    ```ini
    [[RNode LoRa Interface]]
      type = RNodeInterface
      enabled = yes
      port = /dev/ttyUSB0
      frequency = 923200000
      bandwidth = 125000
      txpower = 13
      spreadingfactor = 8
      codingrate = 5
    ```

=== "Southeast Asia"

    Applies to Malaysia, Singapore, Thailand, Vietnam, Indonesia, Cambodia, Hong Kong, and Taiwan.

    Max legal power is typically 16 dBm.

    ```ini
    [[RNode LoRa Interface]]
      type = RNodeInterface
      enabled = yes
      port = /dev/ttyUSB0
      frequency = 920500000
      bandwidth = 125000
      txpower = 16
      spreadingfactor = 8
      codingrate = 5
    ```

Always verify the regulations for your specific country before transmitting. The `txpower`
value is also limited by your hardware. SX1276/SX1278 boards max out at 17 dBm, while
SX1262/SX1268 boards can go up to 22 dBm.
