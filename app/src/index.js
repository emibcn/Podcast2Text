'use strict'

const fs = require('fs')

async function main (filename) {
  // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech')

  // Creates a client
  const client = new speech.SpeechClient()

  // The name of the audio file to transcribe
  const fileName = filename

  // Reads a local audio file and converts it to base64
  const file = fs.readFileSync(fileName)
  const audioBytes = file.toString('base64')

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes
  }
  const recognitionMetadata = {
    interactionType: 'PROFESSIONALLY_PRODUCED',
    microphoneDistance: 'NEARFIELD',
    recordingDeviceType: 'OTHER_INDOOR_DEVICE'
  }
  const config = {
    encoding: 'FLAC',
    sampleRateHertz: 44100,
    languageCode: 'ca-ES',
    alternativeLanguageCodes: ['es-ES', 'ca-ES'],
    enableSpeakerDiarization: true,
    diarizationSpeakerCount: 4,
    metadata: recognitionMetadata
  }
  const request = {
    audio,
    config
  }

  // Detects speech in the audio file
  const [response] = await client.recognize(request)
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join('\n')
  console.log(`Transcription: ${transcription}`, response.results)
  console.log('Speaker Diarization:')
  const result = response.results[response.results.length - 1]
  const wordsInfo = result.alternatives[0].words
  // Note: The transcript within each result is separate and sequential per result.
  // However, the words list within an alternative includes all the words
  // from all the results thus far. Thus, to get all the words with speaker
  // tags, you only have to take the words list from the last result:
  wordsInfo.forEach((a) =>
    console.log(` word: ${a.word}, speakerTag: ${a.speakerTag}`)
  )
}

// Parse arguments
const args = process.argv.slice(2)
if (args.length < 1) {
  console.error(
    'First argument must be file name to process (max 1 minute 44100Hz FLAC file; catalan and/or spanish spoken)'
  )
  process.exit(1)
}
const [filename] = args

// Test file exists
try {
  fs.existsSync(filename)
} catch (err) {
  console.error(err)
}

// Call processing function
main(filename).catch(console.error)
