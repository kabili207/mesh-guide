# Setting up Reticulum

Unlike Meshtastic or MeshCore, Reticulum is a lot more hands-on. It's designed to run over
*any* transport mechanism that can send the necessary packet sizes, from a fiber optic backbone
to a morse code link. The network picks the best available path to a node, not just the one
with the fewest hops.

## Installing 

```sh
sudo apt install pipx

pipx ensurepath
pipx install rns
pipx inject rns nomadnet --install-apps
```

Note that `pipx inject` installs NomadNet into the same virtual environment as `rns`, rather
than giving it its own. This is required so that NomadNet can access the Reticulum libraries.

## Configuring

Run the `rnsd` command once and wait for it to say it's started, then hit `Ctrl+C`

```
user@laptop:~$ rnsd
[2026-03-17 14:48:00] [Notice]   Could not load config file, creating default configuration file...
[2026-03-17 14:48:00] [Notice]   Default config file created. Make any necessary changes in /home/user/.reticulum/config and restart Reticulum if needed.
[2026-03-17 14:48:03] [Notice]   Started rnsd version 1.1.4
^C
user@laptop:~$ 
```

Open the config file mentioned, which should be the at `~/.reticulum/config`

The defaults are mostly good, but you'll want to add some gateways to the `[interfaces]`
section at the very bottom.

## Interfaces

Throughout this guide you'll see the terms "interface", "gateway", and "transport" used loosely.
In Reticulum, an **interface** is the config-level definition of a connection, i.e. what you
add to your config file. A **gateway** is a remote node that your interface connects to,
and **transport** refers to the underlying method used to carry traffic (TCP, I2P, etc.).
In practice they're closely related, so don't worry too much about the distinction.

Some gateways will inevetiably go down from time to time, so it's wise to choose a good balance
so you have a few fallbacks.

There are several public gateways you can use, which you can find an up to date listing at the
[RNS Directory](https://directory.rns.recipes/). This guide will only show a select few of the
more stable ones. Ideally you would pick gateways closet to your local mesh and/or people you
desire to talk to.

### The Default Auto Interface

This automatically finds and connects to other Reticulum nodes on your local Wifi/Ethernet.

If you are aiming for a more privacy oriented setup, you will want to set `enabled = No`.

```ini
  [[Default Interface]]
    type = AutoInterface
    enabled = No
```

### TCP/Backbone

The most common interfaces. These just work over the regular internet.

If you care about privacy, these gateways can see your public IP address.

```ini
[[RMAP]]
  type = TCPClientInterface
  enabled = yes
  target_host = rmap.world
  target_port = 4242

[[RNS_Transport_US-East]]
  type = TCPClientInterface
  enabled = yes
  target_host = 45.77.109.86
  target_port = 4965

[[Sydney RNS]]
  type = TCPClientInterface
  enabled = yes
  target_host = sydney.reticulum.au
  target_port = 4242

[[RNS TCP Node Germany 002]]
  type = TCPClientInterface
  enabled = yes
  target_host = 193.26.158.230
  target_port = 4965

[[MichMesh]]
  type = BackboneInterface
  enabled = yes
  remote = rns.michmesh.net
  target_port = 7822
```

Note that MichMesh uses `BackboneInterface` with `remote` instead of `TCPClientInterface` with
`target_host`. Backbone interfaces are optimized for stable, high-capacity links between network
segments. Use whichever type the gateway operator specifies.

There are plenty more to pick from, but this should get you connected to most RNS users.

### I2P

I2P is similar to Tor but uses a different approach to obfuscating your traffic. I won't go
into the specifics here.

Unfortunately bad actors have abused it for controlling their botnets, so the network can be unstable
at times. I would recommend configuring several I2P interfaces instead of relying on a single one.

```sh
sudo apt install apt-transport-https
wget -q -O - https://repo.i2pd.xyz/.help/add_repo | sudo bash -s -
sudo apt update
sudo apt install i2pd
```

The second command pipes a remote script into `sudo bash`. If you'd prefer to review it first,
download the script with `wget -O add_repo.sh https://repo.i2pd.xyz/.help/add_repo`, inspect it,
then run `sudo bash add_repo.sh`.

After that, the i2pd service should automatically start. Then you can add I2P gateways to your list.

```ini
[[SparkN0de I2P]]
  type = I2PInterface
  enabled = yes
  peers = ccrlk4gdxkgrqr633b4msujteaf7gnqw5akxjiek5dhoosfmrdka.b32.i2p

[[Casbah I2P Relay]]
  type = I2PInterface
  enabled = yes
  peers = nckymqd5qchedbvjqsrlovgwc5iupasu3jjnt7fwws5vd4l552yq.b32.i2p

[[akku i2p]]
  type = I2PInterface
  enabled = yes
  peers = j4qvsmifjuq2fqn4wj34xu7swgqjyror4hx3qgl3aj3ggxmg6hrq.b32.i2p
```

### Yggdrasil

While you might find several Yggdrasil interfaces available, I personally do not recommend using it.
Yggdrasil creates an IPv6 network interface on your computer, effectively putting you on a global
LAN with everyone else on the network. Unless you know how to properly configure a firewall, this
will only expose you to more risk.

## Starting Reticulum

Once you have all of your interface/gateways set up, you can start it again by running `rnsd`

Since gateways come and go, you might see errors in the logs. They're usually safe to ignore, but
if you see them often enough for a certain gateway you can either remove it from the list or set
`enabled = no`.

You can view the status of your connection to the network using the command `rnstatus`

## Starting at boot

If you want reticulum to automatically start when you log in, you can create systemd user service.

```sh
mkdir -p ~/.config/systemd/user
```
Once the destination folder has been created, save the following to the file
`~/.config/systemd/user/rnsd.service`

```ini
{!files/rnsd.service!}
```

The `ExecStart` path assumes `rnsd` was installed via `pipx` into `~/.local/bin/`. If you
installed it differently, run `which rnsd` and update the `ExecStart` path accordingly.

Now run the following commands to ensure it's enabled

```sh
systemctl --user daemon-reload
systemctl --user enable --now rnsd
```

Running the command `rnstatus` should show the list of active interfaces.

## Talking to people

This is why you're here, after all.

The installation instructions included NomadNet, which works but is terminal-based. There are
friendlier options like MeshChat and Columba. Guides for those will be covered separately.

