---
description: Setup Antigravity Browser Automation on WSL2 (NixOS)
---

This workflow helps you configure the networking required for Antigravity to control Chrome running on Windows from a NixOS WSL2 environment.

## Prerequisites (Windows Side)

You must perform these steps manually in **PowerShell as Administrator**:

1.  **Get WSL IP**:
    In this terminal run: `ip route show | grep -i default | awk '{ print $3}'`
    Note this IP (e.g., `172.x.x.x`).

2.  **Configure Port Proxy**:

    ```powershell
    # Replace <WSL_IP> with the IP from step 1
    netsh interface portproxy add v4tov4 listenport=9222 listenaddress=<WSL_IP> connectport=9222 connectaddress=127.0.0.1
    ```

3.  **Allow in Firewall**:

    ```powershell
    New-NetFirewallRule -DisplayName "Chrome Remote Debug" -Direction Inbound -LocalPort 9222 -Protocol TCP -Action Allow
    ```

4.  **Start Chrome**:
    Run this in PowerShell or CMD:
    ```cmd
    "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --no-first-run --no-default-browser-check
    ```

## WSL/NixOS Side Setup

Once Chrome is running on Windows, run the following command in this terminal to start the bridge.
We use `nix-shell` to run `socat` without permanently installing it.

```bash
# Replace <WSL_IP> with the IP found in step 1
nix-shell -p socat --run "socat TCP-LISTEN:9222,fork,reuseaddr TCP:<WSL_IP>:9222"
```

## Verification

In another terminal tab, run:

```bash
curl -v http://127.0.0.1:9222/json/version
```

If you see JSON output, the connection is working!
