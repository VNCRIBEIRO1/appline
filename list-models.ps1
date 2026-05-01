$headers = @{
    "Content-Type" = "application/json"
}
$apiKey = "AIzaSyCS2HAM-gmL28Ji8-trEcAifNRBOx-aadY"

try {
    Write-Host "Listing models..."
    $response = Invoke-RestMethod -Uri "https://generativelanguage.googleapis.com/v1beta/models?key=$apiKey" -Method Get -Headers $headers
    $response.models | Select-Object name, displayName, supportedGenerationMethods | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
