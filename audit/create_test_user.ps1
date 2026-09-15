$headers = @{
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppdnJrb3p4dGhzZmxlZXdha3ZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTI1MDgwNSwiZXhwIjoyMTA0ODI2ODA1fQ.PhHKwscSkUvPl4KUymEYHdo21ANQX_6WbfsJ6k0gq6s"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppdnJrb3p4dGhzZmxlZXdha3ZjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTI1MDgwNSwiZXhwIjoyMTA0ODI2ODA1fQ.PhHKwscSkUvPl4KUymEYHdo21ANQX_6WbfsJ6k0gq6s"
    "Content-Type" = "application/json"
}

# Create a test user via Admin API
$body = @{
    email = "test-trigger-$(Get-Random)@example.com"
    password = "testpassword123"
    email_confirm = $true
    user_metadata = @{
        username = "testuser_$(Get-Random)"
        display_name = "Test User"
    }
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://jivrkozxthsfleewakvc.supabase.co/auth/v1/admin/users" -Method POST -Headers $headers -Body $body
$response | ConvertTo-Json -Depth 10