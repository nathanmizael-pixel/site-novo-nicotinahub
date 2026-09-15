$headers = @{
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppdnJrb3p4dGhzZmxlZXdha3ZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTI1MDgwNSwiZXhwIjoyMTA0ODI2ODA1fQ.PhHKwscSkUvPl4KUymEYHdo21ANQX_6WbfsJ6k0gq6s"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppdnJrb3p4dGhzZmxlZXdha3ZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTI1MDgwNSwiZXhwIjoyMTA0ODI2ODA1fQ.PhHKwscSkUvPl4KUymEYHdo21ANQX_6WbfsJ6k0gq6s"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}

# Check if trigger function exists
$sql = "SELECT proname, prosrc FROM pg_proc WHERE proname = 'handle_new_user'"
$body = @{sql = $sql} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "https://jivrkozxthsfleewakvc.supabase.co/rest/v1/rpc/execute_sql" -Method POST -Headers $headers -Body $body
$response | ConvertTo-Json -Depth 10