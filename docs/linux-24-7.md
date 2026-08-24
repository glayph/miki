# Linux 24/7 Operation

Agent Miki is designed to run as a user-level `systemd` service on Ubuntu or another Linux distribution with Node.js 20 or newer. The service unit restarts the process after failure, starts after network availability, and keeps writable state under `~/.local/share/miki`.

From a clean checkout, run `deploy/install-linux.sh`. The script installs dependencies, builds the project, installs a user-level unit, and starts it. Verify readiness with `npm run runtime:24-7:check` and inspect the service with `systemctl --user status miki.service`.

Keep the dashboard bound to loopback unless a reverse proxy, HTTPS, authentication, and firewall policy are deliberately configured. Do not expose a database or unauthenticated admin endpoint directly to the public internet. Store provider credentials in `config/.env` or the dashboard secret vault; never commit that file.

If the Linux host reboots, enable lingering for the service account with `loginctl enable-linger "$USER"` so the user service can start without an interactive login. Review logs with `journalctl --user -u miki.service` and rotate or retain them according to the host’s operational policy.
