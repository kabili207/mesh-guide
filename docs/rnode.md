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

First, plug in your device and then look for the correct tty device by running `ls /dev/tty*`.
It will usually be named something starting with `ttyUSB`, `ttyACM`, or `ttyAMA`. If multiple show up,
disconnect the node, re-run the ls command to see what disappeared, plug it back in, and finally run the
ls command once more to verify it.

Once you've figured out what tty it's using, run the command below with the correct path. This example
will be using `/dev/ttyUSB0`

```sh
rnodeconf --autoinstall /dev/ttyUSB0
```

You should see a bunch of text followed by a prompt asking you to select your device. Type the number
beside your device and then hit `Enter`.

If instead of the prompt you see a permission denied error, you likely need to add your user to the dialout
group. Do so by typing the following command, substituting your username, and then log out of the computer
and back in again for the change to take effect. Then re-run the rnodeconf command again.

```sh
sudo usermod -aG dialout your_user_name
```

If you are using a Heltec device, you will likely encounter the warning below. Just hit `Enter` to continue.

```text
---------------------------------------------------------------------------
                     Heltec LoRa32 v3.0 RNode Installer

Important! Using RNode firmware on Heltec devices should currently be
considered experimental. It is not intended for production or critical use.

The currently supplied firmware is provided AS-IS as a courtesy to those
who would like to experiment with it. Hit enter to continue.
---------------------------------------------------------------------------
```

You will now be asked to select the frequency band. This will depend on the country you live in.
For North America you'll want 915. Europe and India use 868. Australia, New Zealand, southeast Asia, and parts of South America use 923.

Some parts of Europe also support the 433 band, **but this requires different hardware**.

China uses different frequencies entirely and requires special hardware.

```text
What band is this Heltec LoRa32 V3 for?

[1] 433 MHz
[2] 868 MHz
[3] 915 MHz
[4] 923 MHz

```

Once you pick the band you will be presented with a final confirmation screen. Type `Y` and then `Enter` to continue.

If you see a warning about failing to get the version information from the default server, just hit `Enter` and
it will download from an alternate instead.

```text
[11:42:11] WARNING!
[11:42:11] Failed to retrieve latest version information for your board from the default server.
[11:42:11] Will retry using the following fallback URL: https://github.com/markqvist/rnode_firmware/releases/latest/download/release.json
[11:42:11] 
[11:42:11] Hit enter if you want to proceed
```

### Preserving screen life

Some versions of the firmware don't turn off or dim the screen when idle, which can cause burn-in.
The screen only shows the firmware version, BLE status, and airtime usage, so it's not worth
leaving on all the time and permanently damaging the display. You can dim the screen and set the
timeout to 10 seconds with the following command

```text
user@laptop:~$ rnodeconf -D 30 -t 10 /dev/ttyUSB0 
[11:44:29] Opening serial port /dev/ttyUSB0...
[11:44:32] Device connected
[11:44:32] Current firmware version: 1.85
[11:44:32] Reading EEPROM...
[11:44:33] EEPROM checksum correct
[11:44:33] Device signature validated
[11:44:33] Setting display intensity to 30
[11:44:33] Setting display timeout to 10
```

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
| `codingrate` | Forward error correction rate (5–8) | higher means more error resilience. sometimes written as 4/<value> |

`frequency`, `bandwidth`, and `spreadingfactor` must be identical on all nodes that need to
communicate. `txpower` and `codingrate` can differ between nodes.

As a rough guide:

- **Short range, fast:** sf=7, bw=250000 or 500000
- **Balanced (most common):** sf=8, bw=125000
- **Long range, slow:** sf=9–12, bw=62500–125000

### Regional Configurations

Your frequency and power settings depend on your country's radio regulations. Here are common
configurations for each major region. The [Popular RNode Settings](https://github.com/markqvist/Reticulum/wiki/Popular-RNode-Settings) wiki has more community-maintained configs.

If you still aren't sure, look for nodes nearby by visiting the Reticulum World Map. At the time of writing, they are currently beta testing a new method of mapping nodes, so you should check both the [version 3](https://rmap.world/v3/) and [beta version 4](https://rmap.world/) maps.

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
