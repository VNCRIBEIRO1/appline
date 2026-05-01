$headers = @{
    "Content-Type" = "application/json"
}
$body = @{
    niches = @("natureza")
    quantity = 1
} | ConvertTo-Json

try {
    Write-Host "Testing /api/generate with models/gemini-2.0-flash-lite..."
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/generate" -Method Post -Headers $headers -Body $body -TimeoutSec 60
    Write-Host "Success!"
    $response.results[0] | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
