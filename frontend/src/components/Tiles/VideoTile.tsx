import React, {RefObject, useEffect, useRef, useState} from 'react';
import './VideoTile.css';
import {useObserver} from 'mobx-react';
import {autorun} from 'mobx';
import AutoPlayAudio from "./AutoPlayAudio";
import {ITileProps} from "./TileContainer";


const VideoTile: React.FunctionComponent<ITileProps> = ({participant, flexBasis, maxWidth}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [audioSrcObject,setAudioSrcObject] = useState<MediaStream | null>(null);

    useEffect(() => {
        videoRef.current?.addEventListener("canplay", () => {
            videoRef.current!.play().catch(e => console.error(e.toString()));
        });
        return autorun(updateMedia);
    }, []);

    function updateMedia() {
        console.log("update media");
        videoRef.current!.srcObject = new MediaStream([participant.mediasoup.consumer.camera!.track]);

        if (participant.hasAudio) {
            setAudioSrcObject(new MediaStream([participant.mediasoup.consumer.microphone!.track]));
        }
    }

    return useObserver(() => (
        <div className={"video-pad"} style={{flexBasis, maxWidth}}>
            <div className={"video-participant-wrapper"}>
                <video autoPlay={true} playsInline={true} muted={true} ref={videoRef}
                       className={"video-participant--video"}/>
                {
                    audioSrcObject &&
                    <AutoPlayAudio srcObject={audioSrcObject}/>
                }
                <span className={"video-participant--name"}>{participant.name}</span>
            </div>
        </div>
    ));
}
export default VideoTile;
