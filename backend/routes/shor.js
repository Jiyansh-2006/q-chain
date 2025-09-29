import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// ---------- CONFIG ----------
const MAX_N_LIMIT = 65535;

// Absolute paths: adjust to your current venv and shor_service.py
const VENV_PYTHON = "D:\\q-chain\\quantum\\qiskit_env\\Scripts\\python.exe";
const SHOR_SCRIPT = "D:\\q-chain\\quantum\\shor_service.py";

// Verify paths exist
if (!fs.existsSync(VENV_PYTHON)) throw new Error(`Python not found: ${VENV_PYTHON}`);
if (!fs.existsSync(SHOR_SCRIPT)) throw new Error(`Shor service not found: ${SHOR_SCRIPT}`);

// ---------- ROUTE ----------
router.get("/simulate_shor", async (req, res) => {
  let responded = false;

  try {
    const p = req.query.p ? parseInt(req.query.p, 10) : undefined;
    const q = req.query.q ? parseInt(req.query.q, 10) : undefined;
    const N = req.query.N ? parseInt(req.query.N, 10) : undefined;
    const message = req.query.message || "A";
    const e = req.query.e ? parseInt(req.query.e, 10) : 65537;

    if (N && (isNaN(N) || N <= 3 || N > MAX_N_LIMIT)) {
      return res.status(400).json({ error: `N must be between 4 and ${MAX_N_LIMIT}` });
    }
    if ((p && isNaN(p)) || (q && isNaN(q))) {
      return res.status(400).json({ error: "Invalid p or q" });
    }
    if (message.length > 8) {
      return res.status(400).json({ error: "Message too long; use <=8 chars." });
    }

    const args = [];
    if (p) args.push("--p", String(p));
    if (q) args.push("--q", String(q));
    if (N) args.push("--N", String(N));
    args.push("--message", message);
    args.push("--e", String(e));

    console.log(`Running: ${VENV_PYTHON} ${SHOR_SCRIPT} ${args.join(' ')}`);

    const py = spawn(VENV_PYTHON, [SHOR_SCRIPT, ...args]);

    let stdout = "";
    let stderr = "";

    py.stdout.on("data", (data) => (stdout += data.toString()));
    py.stderr.on("data", (data) => {
      stderr += data.toString();
      console.error("shor stderr:", data.toString());
    });

    py.on("error", (err) => {
      if (!responded) {
        responded = true;
        console.error("Python spawn failed:", err.message);
        res.status(500).json({ error: "Python spawn failed", details: err.message });
      }
    });

    py.on("close", (code) => {
      if (responded) return;
      
      console.log(`Python process exited with code: ${code}`);
      console.log(`stdout: ${stdout}`);
      
      if (!stdout) {
        responded = true;
        return res.status(500).json({ 
          error: "No output from Shor service", 
          stderr, 
          exitCode: code 
        });
      }

      try {
        const result = JSON.parse(stdout);
        if (result.N && result.N > MAX_N_LIMIT) {
          return res.status(400).json({ error: "N exceeds server demo limit" });
        }
        responded = true;
        return res.json(result);
      } catch (err) {
        responded = true;
        console.error("JSON parse error:", err);
        return res.status(500).json({ 
          error: "Failed to parse Shor service output", 
          raw: stdout, 
          stderr,
          parseError: err.message 
        });
      }
    });
    
    // Timeout protection
    setTimeout(() => {
      if (!responded) {
        responded = true;
        py.kill();
        res.status(500).json({ error: "Request timeout" });
      }
    }, 30000); // 30 second timeout
    
  } catch (err) {
    if (!responded) {
      responded = true;
      console.error("simulate_shor error:", err);
      res.status(500).json({ error: "Internal server error", details: err.message });
    }
  }
});

export default router;