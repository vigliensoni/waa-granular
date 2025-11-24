import type { ChangeEvent } from 'react'
import { useRef } from 'react'
import styled from 'styled-components'
import { GlobalStyle } from './styled'
import { Display } from './Display'
import { useAppState } from './stores/appStore'
import { createAudio } from './audio'
import { Controls } from './Controls'
import { cloneAudioBuffer } from './helpers'
import { Keyboard } from './Keyboard'

createAudio();

function App() {
  const actx = useAppState(state => state.actx)
  const setBuffer = useAppState(state => state.setBuffer)
  const setReverseBuffer = useAppState(state => state.setReverseBuffer)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  async function handleFile(file: File | null) {
    if (file === null) return;

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await actx.decodeAudioData(arrayBuffer);
    setBuffer(audioBuffer);

    const reverseBuffer = cloneAudioBuffer(audioBuffer);

    for (let i = 0; i < reverseBuffer.numberOfChannels; i++) {
      reverseBuffer.getChannelData(i).reverse();
    }
    setReverseBuffer(reverseBuffer);
  }
  
  async function handleLoadSample() {
    if (window.showOpenFilePicker) {
      try {
        const [fileHandle] = await window.showOpenFilePicker({
          types: [
            {
              description: 'Audio files',
              accept: {
                'audio/*': ['.wav', '.ogg', '.mp3', '.mp4', '.aac', '.flac'],
              }
            },
          ],
          excludeAcceptAllOption: true,
          multiple: false,
        });

        await handleFile(await fileHandle.getFile());
      } catch (error) {
        const isAbort = error instanceof DOMException && error.name === 'AbortError';
        // If user cancels, do nothing; otherwise try the input fallback.
        if (!isAbort) fileInputRef.current?.click();
      }
    } else {
      fileInputRef.current?.click();
    }
  }

  async function handleFileInputChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    await handleFile(file);
    event.target.value = '';
  }

  return (
    <Wrapper>
      <GlobalStyle/>
      <Buttons>
        <button onClick={handleLoadSample}>Load sample</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
      </Buttons>
      <Display/>
      <Keyboard/>
      <Controls/>
    </Wrapper>
  )
}

export default App

const Wrapper = styled.div`
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
`

const Buttons = styled.div`
margin: 10px;
display: flex;
gap: 10px;
position: absolute;
z-index: 999;
`
