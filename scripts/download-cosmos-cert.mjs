import { mkdirSync, writeFileSync } from "node:fs";
import tls from "node:tls";
import https from "node:https";
import { dirname, resolve } from "node:path";

const targetPath = process.env.COSMOS_CERT_PATH ?? resolve("api", "certs", "cosmos-emulator.pem");
const url = process.env.COSMOS_CERT_URL ?? "https://localhost:8081/_explorer/emulator.pem";

mkdirSync(dirname(targetPath), { recursive: true });

function rawCertToPem(raw) {
  const base64 = raw.toString("base64");
  const lines = base64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN CERTIFICATE-----\n${lines.join("\n")}\n-----END CERTIFICATE-----\n`;
}

function savePem(pem) {
  writeFileSync(targetPath, pem, "utf8");
  console.log(`Saved Cosmos emulator certificate to ${targetPath}`);
}

function fallbackViaTls(parsedUrl) {
  const host = parsedUrl.hostname;
  const port = parsedUrl.port ? Number(parsedUrl.port) : 443;

  const socket = tls.connect(
    {
      host,
      port,
      servername: host,
      rejectUnauthorized: false,
    },
    () => {
      const cert = socket.getPeerCertificate(true);
      if (!cert?.raw) {
        console.error("Failed to obtain Cosmos emulator certificate via TLS.");
        process.exit(1);
        return;
      }

      savePem(rawCertToPem(cert.raw));
      socket.end();
    },
  );

  socket.on("error", (error) => {
    console.error(`Failed to obtain Cosmos emulator certificate via TLS: ${error.message}`);
    process.exit(1);
  });
}

const parsedUrl = new URL(url);

const request = https.get(
  url,
  {
    rejectUnauthorized: false,
  },
  (response) => {
    let body = "";
    response.setEncoding("utf8");
    response.on("data", (chunk) => {
      body += chunk;
    });
    response.on("end", () => {
      if (response.statusCode === 200 && body.includes("BEGIN CERTIFICATE")) {
        savePem(body);
        return;
      }

      fallbackViaTls(parsedUrl);
    });
  },
);

request.on("error", () => {
  fallbackViaTls(parsedUrl);
});
