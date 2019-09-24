import React from "react";
import Webcam from "react-webcam";
import axios from "./axios";

export default function Scan() {
    const webcamRef = React.useRef(null);

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log("capture", imageSrc);
        const formData = new FormData();
        formData.append("file", imageSrc);
        axios
            .post("./scan", formData)
            .then(response => console.log("response from server", response))
            .catch(err => console.log("error on capture upload", err));
    }, [webcamRef]);

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    return (
        <div>
            <Webcam
                audio={false}
                height={300}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={300}
                videoConstraints={videoConstraints}
            />
            <button onClick={capture}>Capture photo</button>
        </div>
    );
}
