# Mail Panel (Next.js) - Local Self-Hosted Setup

This is a self-hosted mail panel built with Next.js, designed to extend the functionality of the Resend email platform. The application allows:

- Editing template variables directly in raw HTML (not possible in the native Resend template editor).
- Creating broadcasts using existing templates (a feature not available in Resend's native dashboard).
- Previewing both template edits and broadcasts before sending.

It is intended for personal or internal use, running on a local network or VPN. Configuration is stored locally, and it uses a single admin account for access.

---

## Features

- Single admin account with credential-based authentication
- API key management for Resend
- Template editing with variable support
- Broadcast creation from existing templates
- Preview for templates and broadcasts
- Fully containerized via Docker and Docker Compose
- Persistent configuration using a named Docker volume

---

## Requirements

- Docker >= 24  
- Docker Compose >= 2

---

## Environment Variables

Create a `.env` file at the root of the project:

```
CONFIG_DIR=/app/data
NEXTAUTH_SECRET=your-long-random-secret
```

**Notes:**

- `CONFIG_DIR` points to the persistent SQLite data directory inside the container. Keep it as-is unless you modify the Docker Compose volume.  
- `NEXTAUTH_SECRET` should be a long random string for JWT signing.  
- You can use `.env.template` as a reference for what to include in your `.env`.

---

## Docker Setup

1. Build and start the container:

```bash
docker-compose up --build -d
```

2. Check logs (optional):

```bash
docker-compose logs -f
```

3. **Named Volume**

The container uses a named volume `app-data` for persistent storage:

```yaml
volumes:
  app-data: ./data
```

This ensures your configuration, admin password, API keys, and SQLite database persist across container restarts.

---

## Initial Setup

1. Open your browser to:

```
http://<your-server-ip>:3333/setup
```

2. Enter:

- A username  
- A password  
- Your Resend API key  
- A "from" email address for sending emails  
  > Note: not implemented in the app in any meaningful way... yet
  

3. Save the setup. You will then be redirected to the sign-in page.

---

## Sign In

1. Open:

```
http://<your-server-ip>:3333/signin
```

2. Enter your admin credentials.  
3. Once logged in, the dashboard, template editor, and settings drawer will be accessible.

---

## Notes

- **Local network only:** This app is designed for single-admin use and small-scale deployments. Hosting on a public domain is possible but not recommended without adding extra security measures such as HTTPS, strong passwords, and potentially multi-user support.
- **No password reset:** This is a single-admin setup; passwords can be updated via the settings drawer after logging in.  
- **Resend API key:** The key is securely stored inside the SQLite database located in the persistent `data` folder and can be updated from the settings drawer.

---

## Stopping & Removing

```bash
docker-compose down
```

The named volume (`app-data`) ensures your configuration persists even if the container is removed.

---

## Optional: Reset Configuration

If you want to reset the admin account or API key, remove the `app-data` volume:

```bash
docker volume rm <your-project>_app-data
```

Then restart the container and go through the setup again.

---

## License

MIT
