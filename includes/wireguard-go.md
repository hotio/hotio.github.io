## WireGuard Go

This image includes `wireguard-go`, the Go implementation of WireGuard which runs in userspace. Systems like Synology, Qnap or others with missing kernel modules can make use of this to establish a WireGuard VPN connection. It requires the following two changes.

A change to your `wg0.conf`, due to a long lasting bug in WireGuard on these systems. You'll need to change the `AllowedIPs` line to have WireGuard start up properly. Also an extra `PostUp` might have to be added, play with them to see what works best for your particular system.

```text
[Interface]
...
PostUp = wg set wg0 fwmark 51820 && ip -4 rule add not fwmark 51820 table 51820 && ip -4 rule add table main suppress_prefixlength 0 && iptables-restore -n
...

...
[Peer]
...
AllowedIPs = 0.0.0.0/1,128.0.0.0/1
...
```

Next, you'll also need to add a device mapping.

=== "cli"

    ```shell
    --device /dev/net/tun:/dev/net/tun
    ```

=== "compose"

    ```yaml
    devices:
      - /dev/net/tun:/dev/net/tun
    ```
