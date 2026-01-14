function Initialize-Certs {
    [CmdletBinding()]
    param()

    # Path to combined certs
    $certPath = "$env:USERPROFILE\.certs\all.pem"
    $certDir = Split-Path $certPath -Parent

    # Create directory if it doesn't exist
    if (!(Test-Path $certDir)) {
        New-Item -ItemType Directory -Path $certDir | Out-Null
    }

    Write-Host "Exporting Root and Intermediate certificates..."

    # Collect Root and Intermediate certificates
    $rootCerts = Get-ChildItem -Path Cert:\LocalMachine\Root
    $intermediateCerts = Get-ChildItem -Path Cert:\LocalMachine\CA

    # Combine into a single PEM file
    $pemContent = ""
    foreach ($cert in $rootCerts + $intermediateCerts) {
        $pem = "-----BEGIN CERTIFICATE-----`n" +
               [System.Convert]::ToBase64String($cert.RawData, 'InsertLineBreaks') +
               "`n-----END CERTIFICATE-----`n"
        $pemContent += $pem
    }

    Set-Content -Path $certPath -Value $pemContent -Encoding ascii
    Write-Host "Certificates exported to $certPath"

    # Environment variable list
    $envVars = @{
        "GIT_SSL_CAINFO"   = $certPath
        "AWS_CA_BUNDLE"    = $certPath
        "NODE_EXTRA_CA_CERTS" = $certPath
    }

    # Apply environment variables for current session
    foreach ($kvp in $envVars.GetEnumerator()) {
        Set-Item -Path "Env:$($kvp.Key)" -Value $kvp.Value
    }

    # Persist environment variables system-wide
    foreach ($kvp in $envVars.GetEnumerator()) {
        [System.Environment]::SetEnvironmentVariable($kvp.Key, $kvp.Value, [System.EnvironmentVariableTarget]::Machine)
    }

    Write-Host "System-wide environment variables set."

    # Configure npm and yarn to use the cert bundle
    npm config set -g cafile "$certPath"
    npm config set -g strict-ssl true

    # Yarn may not be installed globally on all systems — check first
    #if (Get-Command yarn -ErrorAction SilentlyContinue) {
    #    yarn config set cafile "$certPath" -g
    #    yarn config set strict-ssl true -g
    #}

    Write-Host "`n✅ Certificate setup complete!"
    Write-Host "PEM path: $certPath"
    Write-Host "Restart terminals or apps to pick up system-wide variables."
}

# Run the function
Initialize-Certs
