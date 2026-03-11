# Coolify Extension for Chatons

Manage your [Coolify](https://coolify.io/) infrastructure directly from Chatons conversations.

## Features

- 📱 **List Applications** - View all applications on your Coolify instance
- 🖥️ **Manage Servers** - List, validate, and inspect server resources
- 🗄️ **Database Management** - Start, stop, restart, and monitor databases
- ⚙️ **Service Control** - Manage services across your infrastructure
- 🚀 **Deployment Tracking** - Monitor and trigger deployments
- 📊 **Resource Overview** - Get insights into your Coolify projects and teams

## Installation

1. Open Chatons settings
2. Go to Extensions → Add Extension
3. Search for or paste: `@thibautrey/chatons-extension-coolify`
4. Click Install

## Configuration

1. Navigate to the extension settings
2. Enter your **Coolify instance URL** (e.g., `https://coolify.your-domain.com`)
3. Generate an **API token** in Coolify dashboard: **Settings → API Tokens**
4. Paste the token as Bearer authentication
5. Save and test

## Usage

### Basic Commands

```
"List my Coolify applications"
"Get details of server XYZ"
"Show all databases on my Coolify instance"
"Restart application ABC"
```

### Advanced Operations

```
"Deploy application UUID with force rebuild"
"Show resources on all my servers"
"List all Coolify projects"
"Validate server connection"
```

## Available Tools

- `coolify_list_applications` - List applications with optional tag filtering
- `coolify_get_application` - Get application details
- `coolify_application_action` - Start/stop/restart applications
- `coolify_delete_application` - Delete applications
- `coolify_list_servers` - List all servers
- `coolify_get_server` - Get server details
- `coolify_get_server_resources` - List resources on a server
- `coolify_get_server_domains` - List domains on a server
- `coolify_validate_server` - Validate server connection
- `coolify_list_databases` - List databases
- `coolify_get_database` - Get database details
- `coolify_database_action` - Start/stop/restart databases
- `coolify_list_services` - List services
- `coolify_get_service` - Get service details
- `coolify_service_action` - Start/stop/restart services
- `coolify_list_deployments` - List deployments
- `coolify_get_deployment` - Get deployment details
- `coolify_deploy` - Trigger deployments
- `coolify_list_projects` - List projects
- `coolify_list_resources` - List all resources
- `coolify_list_teams` - List teams
- `coolify_get_current_team` - Get current team info
- `coolify_healthcheck` - Check instance health
- `coolify_version` - Get instance version
- `coolify_get_application_logs` - Get application logs

## Security

- All communication with Coolify uses secure Bearer token authentication
- Tokens are stored securely in Chatons' encrypted storage
- No credentials are logged or exposed in conversations
- Input validation on all requests

## Requirements

- Coolify instance running and accessible
- Valid API token with appropriate permissions
- Network access from your Chatons client to Coolify instance

## Support

For issues or feature requests, please open an issue on [GitHub](https://github.com/thibautrey/chatons-extension-coolify).

## License

MIT

---

**Version**: 1.0.0  
**Author**: @thibautrey  
**Repository**: https://github.com/thibautrey/chatons-extension-coolify
