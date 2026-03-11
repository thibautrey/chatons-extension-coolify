# Coolify Extension for Chatons

Interact with your Coolify instance directly from Chatons to manage applications, servers, databases, services, deployments, and projects.

## Features

- 📦 List and manage applications
- 🖥️ View and validate servers
- 💾 Manage databases and services
- 🚀 Trigger deployments
- 📊 Monitor resources and health

## Setup

1. Open the extension in Chatons
2. Enter your Coolify instance URL (e.g., `https://coolify.example.com`)
3. Generate an API token in Coolify dashboard: **Settings → API Tokens**
4. Save your credentials securely

## API Reference

All Coolify API endpoints are available through LLM tools:

- `coolify_list_applications` - List applications
- `coolify_get_application` - Get application details
- `coolify_application_action` - Start/stop/restart applications
- `coolify_list_servers` - List servers
- `coolify_list_databases` - List databases
- `coolify_list_deployments` - List deployments
- `coolify_deploy` - Trigger a deployment
- And more...

## Security

- Your API credentials are stored securely in Chatons local storage
- Credentials are never logged or exposed
- All communication with Coolify uses Bearer token authentication
- Input validation on URL and token formats

## Troubleshooting

If credentials fail to save:
1. Ensure Coolify instance URL is complete (includes `https://`)
2. Verify API token is valid
3. Restart Chatons if the issue persists
4. Check browser console for detailed error messages

## Support

For issues, please contact the extension maintainer or check Chatons documentation.
