import React, { useState } from "react";
import Webcam from "react-webcam";
import axios from "./axios";

export default function Scan() {
    const webcamRef = React.useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [email, setEmail] = useState("");

    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        console.log("capture", imageSrc);

        const image = {
            imageSrc: imageSrc
        };
        axios
            .post("./scan", image)
            .then(response => {
                console.log("email from server", response.data);
                setModalVisible(true);
                setEmail(response.data);
            })
            .catch(err => console.log("error on capture upload", err));
    }, [webcamRef]);

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    return (
        <div className="webcam">
            <Webcam
                audio={false}
                height={600}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={800}
                videoConstraints={videoConstraints}
            />
            <button onClick={capture}>Capture photo</button>
            {modalVisible && (
                <div className="modal">
                    <p>Would you like to send a message to {email}?</p>
                    <div className="button-wrapper">
                        <button>Send</button>
                        <button>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
