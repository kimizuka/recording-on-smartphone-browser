import RecorderService from '../../public/js/RecorderService';
import utils from '../../public/js/Utils';
import styled from 'styled-components';
import Head from 'next/head';
import { useState, useEffect } from 'react';

type Recording = {
  ts: number;
  blobUrl: string;
  mimeType: string;
  size: number;
};

const Wrapper = styled.div`
  .inner {
    margin: auto;
    max-width: 320px;
  }

  ol {
    padding: 16px 0 120px;
  }

  li {
    display: flex;
    align-items: center;
    justify-content: center;

    + li {
      padding-top: 8px;
    }
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    bottom: 0;
    left: 0; right: 0;
    height: 120px;
  }

  .btn-recording {
    position: relative;
    margin: auto;
    border: solid 8px #fff;
    border-radius: 50%;
    width: 88px; height: 88px;
    cursor: pointer;

    &:before {
      display: block;
      position: absolute;
      top: 0; bottom: 0;
      left: 0; right: 0;
      margin: auto;
      border-radius: 50%;
      width: 64px; height: 64px;
      content: '';
      background: #FF1744;
      transition: width .4s ease-in-out,
                  height .4s ease-in-out,
                  border-radius .4s ease-in-out;
    }

    &[data-recording-in-progress='true'] {
      &:before {
        border-radius: 25%;
        width: 40px; height: 40px;
      }
    }
  }
`;

export default function IndexPage() {
  const [ recorderService, setRecorderService ] = useState(null);
  const [ recordings, setRecordings ] = useState<Recording[]>([]);
  const [ recordingInProgress, setRecordingInProgress ] = useState(null);

  useEffect(() => {
    if (recorderService) {
      window.addEventListener('keypress', handleKeypress);

      return;
    }

    setRecorderService(new RecorderService());

  }, [recorderService]);

  useEffect(() => {
    if (recordingInProgress) {
      window.addEventListener('keypress', handleKeypress);
    }
  }, [recordingInProgress]);

  useEffect(() => {
    if (!recordings.length) {
      return;
    }

    console.log(recordings);
    window.addEventListener('keypress', handleKeypress);
  }, [recordings]);

  function handleRecording(evt) {
    onNewRecording(evt);
  }

  function handleKeypress() {
    window.removeEventListener('keypress', handleKeypress);
    handleClickBtnRecording();
  }

  function handleClickBtnRecording() {
    if (recordingInProgress) {
      stopRecording();
      recorderService.em.removeEventListener('recording', handleRecording);
    } else {
      recorderService.em.addEventListener('recording', handleRecording);
      startRecording();
    }
  }

  function startRecording() {
    recorderService.config.stopTracksAndCloseCtxWhenFinished = true;
    recorderService.config.createDynamicsCompressorNode = false;
    recorderService.config.enableEchoCancellation = true;
    recorderService.startRecording().then(() => {
      setRecordingInProgress(true);
    }).catch((err) => {
      console.error(err);
    });
  }

  function stopRecording() {
    recorderService.stopRecording();
    setRecordingInProgress(false);
  }

  function onNewRecording (evt) {
    setRecordings([...recordings, evt.detail.recording]);
  }

  return (
    <Wrapper>
      <Head>
        <style>body {'{'} background: #212121; {'}'}</style>
      </Head>
      <div className="inner">
        <ol> {
          recordings.map((recording) => {
            if (!recording.ts) {
              return <div />
            }

            return (
              <li key={ recording.ts }>
                <audio
                  src={ recording.blobUrl }
                  controls
                />
              </li>
            )
          })
        } </ol>
        <footer>
          <div
            onClick={ handleClickBtnRecording }
            data-recording-in-progress={ String(recordingInProgress || false) }
            className="btn-recording"
          />
        </footer>
      </div>
    </Wrapper>
  );
}