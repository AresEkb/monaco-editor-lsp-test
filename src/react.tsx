import { MonacoEditorReactComp } from '@typefox/monaco-editor-react';
import { WrapperConfig } from 'monaco-editor-wrapper';
import { createRoot } from 'react-dom/client';
import { LogLevel } from '@codingame/monaco-vscode-api';
import { configureDefaultWorkerFactory } from 'monaco-editor-wrapper/workers/workerLoaders';

import './style.css';

export function ReactPythonEditor() {
  const config: WrapperConfig = {
    $type: 'extended',
    logLevel: LogLevel.Debug,
    editorAppConfig: {
      editorOptions: {
        language: 'python',
      },
      codeResources: {
        modified: {
          text: 'print("Hello world")\n',
          enforceLanguageId: 'python',
          uri: 'test',
        },
      },
      monacoWorkerFactory: configureDefaultWorkerFactory,
    },
    languageClientConfigs: {
      configs: {
        python: {
          clientOptions: {
            documentSelector: ['python'],
          },
          connection: {
            options: {
              $type: 'WebSocketUrl',
              url: 'ws://localhost:5007',
            },
          },
        },
      },
    },
  };
  return <MonacoEditorReactComp className="editor" wrapperConfig={config} />
}

createRoot(document.getElementById('root')!).render(<ReactPythonEditor />);
