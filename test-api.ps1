$headers = @{
    "Content-Type" = "application/json"
}
$body = @{
    niches = @("natureza")
    quantity = 1
} | ConvertTo-Json

try {
    Write-Host "Testing /api/generate..."
    $response = Invoke-RestMethod -Uri "https://appline-seven.vercel.app/api/generate" -Method Post -Headers $headers -Body $body -TimeoutSec 60
    Write-Host "Success!"
    $response.results[0] | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
