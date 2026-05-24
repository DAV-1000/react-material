import { mkdirSync, writeFileSync } from "node:fs";
import tls from "node:tls";
import { dirname, resolve } from "node:path";

const targetPath =
  process.env.COSMOS_CERT_PATH ??
  resolve(".certs", "cosmos-emulator.pem");

const cosmosHost = process.env.COSMOS_HOST ?? "localhost";
const cosmosPort = Number(process.env.COSMOS_PORT ?? "8081");

mkdirSync(dirname(targetPath), { recursive: true });

function rawCertToPem(raw) {
  const base64 = raw.toString("base64");
  const lines = base64.match(/.{1,64}/g) ?? [];

  const rtn = [
    "-----BEGIN CERTIFICATE-----",
    ...lines,
    "-----END CERTIFICATE-----",
    "",
  ].join("\n");
  console.log(rtn);
  return rtn;
}

function savePem(pem) {
  writeFileSync(targetPath, pem, "utf8");
  console.log(`Saved Cosmos emulator certificate to ${targetPath}`);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchCertificate(retries = 20) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await new Promise((resolve, reject) => {
        const socket = tls.connect(
          {
            host: cosmosHost,
            port: cosmosPort,
            servername: cosmosHost,

            rejectUnauthorized: false,

            // Cosmos emulator can be unstable during startup
            minVersion: "TLSv1.2",
            maxVersion: "TLSv1.2",
          },
          () => {
            try {
              const cert = socket.getPeerCertificate(true);

              if (!cert) {
                socket.end();
                reject(new Error("No certificate returned"));
                return;
              }

              const pemParts = [];
              const seen = new Set();

              let current = cert;

              while (current) {
                if (current.raw) {
                  const fingerprint =
                    current.fingerprint256 ?? current.subject?.CN;

                  if (!seen.has(fingerprint)) {
                    seen.add(fingerprint);
                    pemParts.push(rawCertToPem(current.raw));
                  }
                }

                // Stop at self-signed root
                if (
                  current.issuerCertificate === current ||
                  !current.issuerCertificate
                ) {
                  break;
                }

                current = current.issuerCertificate;
              }

              if (pemParts.length === 0) {
                socket.end();
                reject(new Error("No PEM certificates extracted"));
                return;
              }

              savePem(pemParts.join("\n"));

              socket.end();
              resolve();
            } catch (error) {
              socket.end();
              reject(error);
            }
          },
        );

        socket.on("error", reject);
      });

      return;
    } catch (error) {
      console.log(
        `Waiting for Cosmos emulator (${attempt}/${retries}): ${error.message}`,
      );

      await wait(3000);
    }
  }

  console.error("Cosmos emulator never became ready.");
  process.exit(1);
}

await fetchCertificate();