# Monaco Editor LSP Test

Run client:

```bash
bun run dev
```

Run server:

```bash
mkdir pylsp
cd pylsp 
python3 -m venv .
./bin/pip install python-lsp-server websockets
./bin/pylsp --ws --port 5007
```

Open in browser: <http://localhost:5173/>
