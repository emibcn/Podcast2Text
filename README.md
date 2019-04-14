Proof of Concept for transcoding podcasts into text using GCP Speech2Text service, following its [NODE JS tutorial](https://cloud.google.com/speech-to-text/docs/quickstart-client-libraries).

# Installation
1. Download this repo:
  ```shell
  git clone https://github.com/emibcn/Podcast2Text.git
  ```
2. Change directory into it:
  ```shell
  cd Podcast2Text
  ```
3. Create local directories:
  ```shell
  mkdir flac credentials
  ```
4. Create GCP credentials for consuming Speech2Text service at [GCP IAM](https://console.cloud.google.com/iam-admin/iam) with -at least- `Service Usage Consumer` permission.
5. Copy credentials file to `./credentials` directory
6. Create `.env` file with `GOOGLE_APPLICATION_CREDENTIALS=[CREDENTIALS FILENAME]` (without directory)

# Usage
There is a script helper to transcode any audio file into text. It's syntax is:
```shell
./transcode <FILEPATH> [START]
```

- `FILEPATH`: Path (relative or absolute) to podcast audio file
- `START`: Initial start seek (transcode beginning at this position). Same syntax as FFMPEG `-ss` option.

This will encode the supplied file to FLAC format into `./flac` directory and then use the encoded file to send it to GCP Speech2Text service and get its transcription printed on screen.
