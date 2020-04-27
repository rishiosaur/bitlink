import {ParticipantInformation} from "./ParticipantsStore";
import {observable} from "mobx";
import {types} from 'mediasoup-client'

export interface CurrentUserInformation extends ParticipantInformation {
    key: string
}

interface MediasoupObj {
    transports: {
        sending: types.Transport | null,
        receiving: types.Transport | null
    },
    producers: {
        video: types.Producer | null,
        audio: types.Producer | null
    }
}

interface StreamsObject {
    video: MediaStream | null,
    audio: MediaStream | null,
}


class CurrentUserInformationStore {
    @observable
    public info?: CurrentUserInformation;

    public chosenName?: string;
    public mediasoup: MediasoupObj = {
        transports: {
            sending: null,
            receiving: null
        },
        producers: {
            video: null,
            audio: null
        },
    };

    @observable
    public preferredInputs = {
        video: localStorage.getItem("preferred-video-input") ?? null,
        audio: localStorage.getItem("preferred-audio-input") ?? null,
    };

    private cachedStreams: StreamsObject = {
        video: null,
        audio: null
    };


    reset() {
        this.chosenName = undefined;
        this.info = undefined;
    }

    pause(kind: "video" | "audio") {
        this.mediasoup.producers[kind]?.pause();
        if (kind === "video") {
            this.info!.mediaState.cameraEnabled = false;
        } else {
            this.info!.mediaState.microphoneEnabled = false;
        }
    }

    resume(kind: "video" | "audio") {
        this.mediasoup.producers[kind]?.resume();
        if (kind === "video") {
            this.info!.mediaState.cameraEnabled = true;
        } else {
            this.info!.mediaState.microphoneEnabled = true;
        }
    }

    setPreferredInput(kind: "video" | "audio", deviceId: string) {
        this.preferredInputs[kind] = deviceId;
        localStorage.setItem(`preferred-${kind}-input`, deviceId)
    }

    async getVideoStream(): Promise<MediaStream> {
        if (!this.preferredInputs.video) {
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia({video: {facingMode: {ideal: "user"}}});
            this.setPreferredInput("video", stream.getVideoTracks()[0].getSettings().deviceId!);
        }
        if (this.cachedStreams.video?.getVideoTracks()[0].getSettings().deviceId !== this.preferredInputs.video) {
            const stream = await navigator.mediaDevices.getUserMedia({video: {deviceId: {exact: this.preferredInputs.video!}}});
            this.cachedStreams.video = stream;
            return stream;
        }
        return this.cachedStreams.video;
    }

    async getAudioStream(): Promise<MediaStream> {
        if (!this.preferredInputs.audio) {
            const stream: MediaStream = await navigator.mediaDevices.getUserMedia({audio: true});
            this.setPreferredInput("audio", stream.getVideoTracks()[0].getSettings().deviceId!);
        }
        if (this.cachedStreams.audio?.getVideoTracks()[0].getSettings().deviceId !== this.preferredInputs.audio) {
            const stream = await navigator.mediaDevices.getUserMedia({audio: {deviceId: {exact: this.preferredInputs.audio!}}});
            this.cachedStreams.audio = stream;
            return stream;
        }
        return this.cachedStreams.audio;
    }
}

export default new CurrentUserInformationStore();
