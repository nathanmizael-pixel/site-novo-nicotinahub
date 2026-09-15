$headers = @{
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppdnJrb3p4dGhzZmxlZXdha3ZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTI1MDgwNSwiZXhwIjoyMTA0ODI2ODA1fQ.PhHKwscSkUvPl4KUymEYHdo21ANQX_6WbfsJ6k0gq6s"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppdnJrb3p4dGhzZmxlZXdha3ZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTI1MDgwNSwiZXhwIjoyMTA0ODI2ODA1fQ.PhHKwscSkUvPl4KUymEYHdo21ANQX_6WbfsJ6k0gq6s"
    "Content-Type" = "application/json"
}

# List all users with pagination
$response = Invoke-RestMethod -Uri "https://jivrkozxthsfleewakvc.supabase.co/auth/v1/admin/users?page=1&per_page=50" -Method GET -Headers $headers
$response | ConvertTo-Json -Depth 10