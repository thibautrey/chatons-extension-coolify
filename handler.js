// Coolify extension handler
// Exports a function(apiName, payload, ctx) that handles all Coolify API calls.

var EXTENSION_ID = '@thibautrey/chatons-extension-coolify';
var API_KEY_STORAGE_KEY = 'coolify_api_key';
var BASE_URL_STORAGE_KEY = 'coolify_base_url';

async function getConfig(ctx) {
  var keyResult = await ctx.storageKvGet(EXTENSION_ID, API_KEY_STORAGE_KEY);
  var urlResult = await ctx.storageKvGet(EXTENSION_ID, BASE_URL_STORAGE_KEY);
  var apiKey = (keyResult && keyResult.ok && typeof keyResult.data === 'string' && keyResult.data.trim())
    ? keyResult.data.trim() : null;
  var baseUrl = (urlResult && urlResult.ok && typeof urlResult.data === 'string' && urlResult.data.trim())
    ? urlResult.data.trim() : null;
  if (!apiKey || !baseUrl) {
    console.warn('[Coolify Extension] Missing configuration. API Key present:', !!apiKey, 'Base URL present:', !!baseUrl);
  }
  return { apiKey: apiKey, baseUrl: baseUrl };
}

function buildRequirementSheetHtml() {
  return '<!DOCTYPE html>\n' +
    '<html>\n<head>\n<meta charset="utf-8">\n' +
    '<style>\n' +
    '  * { box-sizing: border-box; margin: 0; padding: 0; }\n' +
    '  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #1a1a2e; background: transparent; }\n' +
    '  .dark body { color: #e0e0e6; }\n' +
    '  h2 { font-size: 16px; margin-bottom: 8px; }\n' +
    '  p { font-size: 13px; color: #666; margin-bottom: 16px; }\n' +
    '  .dark p { color: #999; }\n' +
    '  label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; margin-top: 12px; }\n' +
    '  input[type="text"] { width: 100%; padding: 8px 12px; border: 1px solid #d0d0d8; border-radius: 6px; font-size: 14px; background: #fff; color: #1a1a2e; outline: none; }\n' +
    '  .dark input[type="text"] { background: #2a2a3e; border-color: #444; color: #e0e0e6; }\n' +
    '  input[type="text"]:focus { border-color: #6c3baa; }\n' +
    '  .actions { display: flex; gap: 8px; margin-top: 16px; }\n' +
    '  button { padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid transparent; }\n' +
    '  .btn-primary { background: #6c3baa; color: #fff; }\n' +
    '  .btn-primary:hover { background: #5a2f96; }\n' +
    '  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }\n' +
    '  .btn-secondary { background: transparent; color: #666; border-color: #d0d0d8; }\n' +
    '  .dark .btn-secondary { color: #999; border-color: #444; }\n' +
    '  .btn-secondary:hover { background: #f0f0f4; }\n' +
    '  .dark .btn-secondary:hover { background: #333; }\n' +
    '  .help { font-size: 12px; color: #888; margin-top: 8px; }\n' +
    '  .help a { color: #6c3baa; text-decoration: none; }\n' +
    '  .help a:hover { text-decoration: underline; }\n' +
    '  .error { color: #e5534b; font-size: 12px; margin-top: 6px; display: none; }\n' +
    '</style>\n</head>\n<body>\n' +
    '  <h2>Coolify Configuration Required</h2>\n' +
    '  <p>Enter your Coolify instance URL and API token to enable infrastructure management.</p>\n' +
    '  <label for="baseUrl">Instance URL</label>\n' +
    '  <input type="text" id="baseUrl" placeholder="https://coolify.example.com" autocomplete="off" spellcheck="false" />\n' +
    '  <label for="apiKey">API Token</label>\n' +
    '  <input type="text" id="apiKey" placeholder="Bearer ..." autocomplete="off" spellcheck="false" />\n' +
    '  <div class="error" id="error">Please fill in both fields.</div>\n' +
    '  <div class="help">\n' +
    '    Generate a token in your Coolify dashboard under\n' +
    '    <a href="https://coolify.io/docs/api-reference" target="_blank" rel="noopener">Settings &rarr; API Tokens</a>\n' +
    '  </div>\n' +
    '  <div class="actions">\n' +
    '    <button class="btn-primary" id="saveBtn" disabled>Save &amp; Continue</button>\n' +
    '    <button class="btn-secondary" id="cancelBtn">Cancel</button>\n' +
    '  </div>\n' +
    '  <script>\n' +
    '    (function() {\n' +
    '      var urlInput = document.getElementById("baseUrl");\n' +
    '      var keyInput = document.getElementById("apiKey");\n' +
    '      var saveBtn = document.getElementById("saveBtn");\n' +
    '      var cancelBtn = document.getElementById("cancelBtn");\n' +
    '      var errorEl = document.getElementById("error");\n' +
    '      try { if (window.parent && window.parent.document && window.parent.document.documentElement.classList.contains("dark")) { document.documentElement.classList.add("dark"); } } catch(_) {}\n' +
    '      function checkValid() { saveBtn.disabled = !(urlInput.value.trim() && keyInput.value.trim()); errorEl.style.display = "none"; }\n' +
    '      urlInput.addEventListener("input", checkValid);\n' +
    '      keyInput.addEventListener("input", checkValid);\n' +
    '      saveBtn.addEventListener("click", async function() {\n' +
    '        var url = urlInput.value.trim().replace(/\\/+$/, "");\n' +
    '        var key = keyInput.value.trim();\n' +
    '        if (!url || !key) { errorEl.textContent = "Please fill in both fields."; errorEl.style.display = "block"; return; }\n' +
    '        try {\n' +
    '          if (!url.startsWith("http://") && !url.startsWith("https://")) throw new Error("URL must start with http:// or https://");\n' +
    '          if (url.length > 500) throw new Error("URL is too long (max 500 characters)");\n' +
    '          if (key.length > 1000) throw new Error("API token is too long (max 1000 characters)");\n' +
    '        } catch(e) {\n' +
    '          errorEl.textContent = e.message || "Invalid input.";\n' +
    '          errorEl.style.display = "block";\n' +
    '          return;\n' +
    '        }\n' +
    '        saveBtn.disabled = true;\n' +
    '        try {\n' +
    '          var chatonBridge = window.parent.chaton || window.chaton;\n' +
    '          if (!chatonBridge) throw new Error("Chatons bridge not found. Ensure this dialog is running within Chatons.");\n' +
    '          if (typeof chatonBridge.extensionStorageKvSet !== "function") throw new Error("Storage API not available in this version of Chatons.");\n' +
    '          var urlResult = await chatonBridge.extensionStorageKvSet("' + EXTENSION_ID + '", "' + BASE_URL_STORAGE_KEY + '", url);\n' +
    '          if (!urlResult || urlResult.error) throw new Error("Failed to save URL: " + (urlResult && urlResult.error || "Unknown storage error"));\n' +
    '          var keyResult = await chatonBridge.extensionStorageKvSet("' + EXTENSION_ID + '", "' + API_KEY_STORAGE_KEY + '", key);\n' +
    '          if (!keyResult || keyResult.error) throw new Error("Failed to save API token: " + (keyResult && keyResult.error || "Unknown storage error"));\n' +
    '          window.parent.postMessage({ type: "chaton:requirement-sheet:confirm" }, "*");\n' +
    '        } catch(e) {\n' +
    '          saveBtn.disabled = false;\n' +
    '          var errorMsg = e.message || String(e) || "Failed to save credentials. Please try again.";\n' +
    '          console.error("[Coolify Extension] Credential save error:", errorMsg, e);\n' +
    '          errorEl.textContent = errorMsg;\n' +
    '          errorEl.style.display = "block";\n' +
    '        }\n' +
    '      });\n' +
    '      cancelBtn.addEventListener("click", function() {\n' +
    '        window.parent.postMessage({ type: "chaton:requirement-sheet:dismiss" }, "*");\n' +
    '      });\n' +
    '      urlInput.focus();\n' +
    '    })();\n' +
    '  </script>\n' +
    '</body>\n</html>';
}

function missingConfigError() {
  return {
    ok: false,
    error: {
      code: 'missing_config',
      message: 'Coolify is not configured. Please provide your instance URL and API token.',
      requirementSheet: {
        html: buildRequirementSheetHtml(),
        title: 'Coolify Configuration',
      },
      pending: true,
    },
  };
}

// Generic REST call to Coolify API
async function coolifyApi(config, method, path, body) {
  if (!config.apiKey || !config.baseUrl) {
    throw new Error('Coolify configuration missing. API key or base URL not set.');
  }
  
  var url = config.baseUrl + '/api/v1' + path;
  var opts = {
    method: method,
    headers: {
      'Authorization': 'Bearer ' + config.apiKey,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };
  if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT' || method === 'DELETE')) {
    opts.body = JSON.stringify(body);
  }

  var res;
  try {
    res = await fetch(url, opts);
  } catch (e) {
    throw new Error('Failed to connect to Coolify at ' + config.baseUrl + ': ' + (e.message || String(e)));
  }

  // Some endpoints return empty 2xx
  var text = await res.text();
  if (!res.ok) {
    var errorDetail = text;
    try { 
      var parsed = JSON.parse(text);
      errorDetail = parsed.message || parsed.error || text;
    } catch(_) {}
    throw new Error('Coolify API error (' + res.status + '): ' + (errorDetail || 'Unknown error'));
  }
  if (!text || text.trim() === '') return {};
  try { return JSON.parse(text); } catch (_) { return { raw: text }; }
}

// ---- Handlers ----

async function listApplications(payload, config) {
  var path = '/applications';
  if (payload.tag) path += '?tag=' + encodeURIComponent(payload.tag);
  return await coolifyApi(config, 'GET', path);
}

async function getApplication(payload, config) {
  return await coolifyApi(config, 'GET', '/applications/' + encodeURIComponent(payload.uuid));
}

async function applicationAction(payload, config) {
  var action = payload.action; // start, stop, restart
  return await coolifyApi(config, 'GET', '/applications/' + encodeURIComponent(payload.uuid) + '/' + action);
}

async function deleteApplication(payload, config) {
  var params = [];
  if (payload.delete_configurations) params.push('delete_configurations=true');
  if (payload.delete_volumes) params.push('delete_volumes=true');
  if (payload.docker_cleanup) params.push('docker_cleanup=true');
  if (payload.delete_connected_networks) params.push('delete_connected_networks=true');
  var qs = params.length > 0 ? '?' + params.join('&') : '';
  return await coolifyApi(config, 'DELETE', '/applications/' + encodeURIComponent(payload.uuid) + qs);
}

async function getApplicationLogs(payload, config) {
  var lines = payload.lines || 100;
  return await coolifyApi(config, 'GET', '/applications/' + encodeURIComponent(payload.uuid) + '/logs?lines=' + lines);
}

async function listServers(payload, config) {
  return await coolifyApi(config, 'GET', '/servers');
}

async function getServer(payload, config) {
  return await coolifyApi(config, 'GET', '/servers/' + encodeURIComponent(payload.uuid));
}

async function getServerResources(payload, config) {
  return await coolifyApi(config, 'GET', '/servers/' + encodeURIComponent(payload.uuid) + '/resources');
}

async function getServerDomains(payload, config) {
  return await coolifyApi(config, 'GET', '/servers/' + encodeURIComponent(payload.uuid) + '/domains');
}

async function validateServer(payload, config) {
  return await coolifyApi(config, 'GET', '/servers/' + encodeURIComponent(payload.uuid) + '/validate');
}

async function listDatabases(payload, config) {
  return await coolifyApi(config, 'GET', '/databases');
}

async function getDatabase(payload, config) {
  return await coolifyApi(config, 'GET', '/databases/' + encodeURIComponent(payload.uuid));
}

async function databaseAction(payload, config) {
  return await coolifyApi(config, 'GET', '/databases/' + encodeURIComponent(payload.uuid) + '/' + payload.action);
}

async function listServices(payload, config) {
  return await coolifyApi(config, 'GET', '/services');
}

async function getService(payload, config) {
  return await coolifyApi(config, 'GET', '/services/' + encodeURIComponent(payload.uuid));
}

async function serviceAction(payload, config) {
  return await coolifyApi(config, 'GET', '/services/' + encodeURIComponent(payload.uuid) + '/' + payload.action);
}

async function listDeployments(payload, config) {
  if (payload.uuid) {
    return await coolifyApi(config, 'GET', '/deploy?uuid=' + encodeURIComponent(payload.uuid));
  }
  return await coolifyApi(config, 'GET', '/deployments');
}

async function getDeployment(payload, config) {
  return await coolifyApi(config, 'GET', '/deployments/' + encodeURIComponent(payload.uuid));
}

async function deploy(payload, config) {
  var params = [];
  if (payload.uuid) params.push('uuid=' + encodeURIComponent(payload.uuid));
  if (payload.tag) params.push('tag=' + encodeURIComponent(payload.tag));
  if (payload.force) params.push('force=true');
  var qs = params.length > 0 ? '?' + params.join('&') : '';
  return await coolifyApi(config, 'GET', '/deploy' + qs);
}

async function listProjects(payload, config) {
  return await coolifyApi(config, 'GET', '/projects');
}

async function getProject(payload, config) {
  return await coolifyApi(config, 'GET', '/projects/' + encodeURIComponent(payload.uuid));
}

async function listResources(payload, config) {
  return await coolifyApi(config, 'GET', '/resources');
}

async function listTeams(payload, config) {
  return await coolifyApi(config, 'GET', '/teams');
}

async function getCurrentTeam(payload, config) {
  return await coolifyApi(config, 'GET', '/teams/current');
}

async function healthcheck(payload, config) {
  return await coolifyApi(config, 'GET', '/health');
}

async function version(payload, config) {
  return await coolifyApi(config, 'GET', '/version');
}

// Routing table
var ROUTES = {
  coolify_list_applications: listApplications,
  coolify_get_application: getApplication,
  coolify_application_action: applicationAction,
  coolify_delete_application: deleteApplication,
  coolify_get_application_logs: getApplicationLogs,
  coolify_list_servers: listServers,
  coolify_get_server: getServer,
  coolify_get_server_resources: getServerResources,
  coolify_get_server_domains: getServerDomains,
  coolify_validate_server: validateServer,
  coolify_list_databases: listDatabases,
  coolify_get_database: getDatabase,
  coolify_database_action: databaseAction,
  coolify_list_services: listServices,
  coolify_get_service: getService,
  coolify_service_action: serviceAction,
  coolify_list_deployments: listDeployments,
  coolify_get_deployment: getDeployment,
  coolify_deploy: deploy,
  coolify_list_projects: listProjects,
  coolify_get_project: getProject,
  coolify_list_resources: listResources,
  coolify_list_teams: listTeams,
  coolify_get_current_team: getCurrentTeam,
  coolify_healthcheck: healthcheck,
  coolify_version: version,
};

function normalizeApiName(apiName) {
  var raw = typeof apiName === 'string' ? apiName.trim() : '';
  if (!raw) return '';
  // Accept dotted names (coolify.list_applications) or underscored
  if (raw.indexOf('coolify.') === 0) {
    return 'coolify_' + raw.slice('coolify.'.length);
  }
  return raw;
}

export default async function handler(apiName, payload, ctx) {
  var p = (payload && typeof payload === 'object' && !Array.isArray(payload)) ? payload : {};
  var normalizedApiName = normalizeApiName(apiName);

  var fn = ROUTES[normalizedApiName];
  if (!fn) {
    var err = { code: 'not_found', message: 'API ' + apiName + ' not found on ' + EXTENSION_ID };
    console.error('[Coolify Extension] ' + err.message);
    return { ok: false, error: err };
  }

  var config = await getConfig(ctx);
  if (!config.apiKey || !config.baseUrl) {
    console.warn('[Coolify Extension] Missing configuration. Showing requirement sheet.');
    return missingConfigError();
  }

  try {
    console.log('[Coolify Extension] Calling API:', normalizedApiName);
    var data = await fn(p, config);
    console.log('[Coolify Extension] API success:', normalizedApiName);
    return { ok: true, data: data };
  } catch (e) {
    var errorMessage = e.message || String(e) || 'Unknown error';
    console.error('[Coolify Extension] API error:', normalizedApiName, errorMessage, e);
    return { ok: false, error: { code: 'api_error', message: errorMessage } };
  }
}
