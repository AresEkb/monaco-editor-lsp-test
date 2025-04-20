import { LogLevel } from '@codingame/monaco-vscode-api';
import getTextmateServiceOverride from '@codingame/monaco-vscode-textmate-service-override';
import getThemeServiceOverride from '@codingame/monaco-vscode-theme-service-override';
import * as monaco from 'monaco-editor';
import { configureDefaultWorkerFactory } from 'monaco-editor-wrapper/workers/workerLoaders';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { ConsoleLogger } from 'monaco-languageclient/tools';
import { initServices } from 'monaco-languageclient/vscode/services';
import { useEffect, useRef } from 'react';
import { CloseAction, ErrorAction } from 'vscode-languageclient/browser.js';
import { toSocket, WebSocketMessageReader, WebSocketMessageWriter } from 'vscode-ws-jsonrpc';

import './style.css';

export function PythonEditor() {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      runClient(editorRef.current);
    }
  }, [editorRef]);

  return <div id="editor" ref={editorRef}></div>;
}

async function runClient(htmlContainer: HTMLElement) {
  const logger = new ConsoleLogger(LogLevel.Debug);
  await initServices(
    {
      serviceOverrides: {
        ...getTextmateServiceOverride(),
        ...getThemeServiceOverride(),
      },
    },
    {
      htmlContainer,
      logger,
    }
  );

  monaco.languages.register({
    id: 'python',
    extensions: ['.py'],
  });

  configureDefaultWorkerFactory(logger);

  monaco.editor.create(htmlContainer, {
    value: `print("Hello from Monaco + LSP!")\n`,
    language: 'python',
    automaticLayout: true,
    wordBasedSuggestions: 'off',
  });

  startLanguageClient('ws://localhost:5007');
}

function startLanguageClient(url: string): WebSocket {
  const webSocket = new WebSocket(url);
  webSocket.onopen = () => {
    const socket = toSocket(webSocket);
    const reader = new WebSocketMessageReader(socket);
    const writer = new WebSocketMessageWriter(socket);
    const languageClient = new MonacoLanguageClient({
      name: 'Python Language Client',
      clientOptions: {
        documentSelector: ['python'],
        errorHandler: {
          error: () => ({ action: ErrorAction.Continue }),
          closed: () => ({ action: CloseAction.DoNotRestart }),
        },
      },
      messageTransports: { reader, writer },
    });
    languageClient.start();
    reader.onClose(() => languageClient.stop());
  };
  return webSocket;
}
